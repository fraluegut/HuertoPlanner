import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import PlantSelectionModal from '../components/Bancal/PlantSelectionModal';

const VistaBancal = () => {
  const [bancales, setBancales] = useState([]);
  const [celdasTemporales, setCeldasTemporales] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCelda, setSelectedCelda] = useState(null);
  const [selectedSemana, setSelectedSemana] = useState(null);
  const [newPlant, setNewPlant] = useState('');
  const [especieFases, setEspecieFases] = useState({});

  useEffect(() => {
    const fetchBancales = async () => {
      try {
        const response = await axios.get('http://localhost:5000/bancales');
        setBancales(response.data);
      } catch (error) {
        console.error("Error al obtener bancales: ", error);
      }
    };

    const fetchCeldasTemporales = async () => {
      try {
        const response = await axios.get('http://localhost:5000/celdas_temporales');
        setCeldasTemporales(response.data);
      } catch (error) {
        console.error("Error al obtener celdas temporales: ", error);
      }
    };

    fetchBancales();
    fetchCeldasTemporales();
  }, []);

  const handleFetchEspecieFases = async (especieId) => {
    try {
      const response = await axios.get(`http://localhost:5000/plantas_fases/${especieId}`);
      setEspecieFases((prevFases) => ({
        ...prevFases,
        [especieId]: response.data
      }));
    } catch (error) {
      console.error("Error al obtener fases de la especie: ", error);
    }
  };

  const getCeldaContentForWeek = (celdas, fila, columna, semana) => {
    const celda = celdas.find(
      (c) => c.fila === fila && c.columna === columna && c.semana === semana
    );
    return celda ? celda.contenido : '';
  };

  const getFaseForWeek = (especieId, semana) => {
    if (!especieFases[especieId]) return '';

    const fases = especieFases[especieId];
    let totalWeeks = 0;

    const phaseNames = [
      'siembra_semanas',
      'germinacion_semanas',
      'crecimiento_semanas',
      'floracion_semanas',
      'fructificacion_semanas',
      'maduracion_semanas',
      'cosecha_semanas',
      'senescencia_semanas'
    ];

    for (const phase of phaseNames) {
      totalWeeks += fases[phase];
      if (semana <= totalWeeks) {
        return phase.replace('_semanas', '');
      }
    }

    return 'finalizado'; // En caso de que se supere la última fase
  };

  const handleCeldaClick = (fila, columna, semana) => {
    setSelectedCelda({ fila, columna });
    setSelectedSemana(semana);
    setModalOpen(true);
  };

  const handleSavePlant = async (plant) => {
    if (!selectedCelda || selectedSemana === null) return;
  
    try {
      const { fila, columna } = selectedCelda;
  
      const existingCelda = celdasTemporales.find(
        (c) => c.fila === fila && c.columna === columna && c.semana === selectedSemana
      );
  
      if (existingCelda) {
        await axios.put(`http://localhost:5000/celdas_temporales/${existingCelda.id}`, {
          contenido: plant,
          semana: selectedSemana,
          ano: new Date().getFullYear() // Añadido para asegurar el año
        });
      } else {
        const response = await axios.post('http://localhost:5000/celdas_temporales', {
          fila,
          columna,
          semana: selectedSemana,
          contenido: plant,
          ano: new Date().getFullYear() // Añadido para asegurar el año
        });
        console.log('Celda creada en la base de datos', response.data);
      }
  
      setCeldasTemporales((prevCeldas) => [
        ...prevCeldas.filter(
          (c) => !(c.fila === fila && c.columna === columna && c.semana === selectedSemana)
        ),
        { fila, columna, semana: selectedSemana, contenido: plant },
      ]);
  
      await handleFetchEspecieFases(plant.id); // Asegura que las fases se obtienen después de guardar la planta
      setModalOpen(false);
    } catch (error) {
      console.error('Error al guardar la planta en la celda temporal:', error.response || error.message || error);
    }
  };

  return (
    <Box p={2}>
      <h2 style={{ textAlign: 'center' }}>Vista Bancal</h2>
      {Array.isArray(bancales) &&
        bancales.map((bancal) => (
          <Box key={bancal.id_bancal} mb={4}>
            <h3>{bancal.nombre}</h3>
            <TableContainer component={Paper} style={{ overflowX: 'auto', maxHeight: '600px' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ minWidth: 80, borderRight: '1px solid #e0e0e0' }}>Celda</TableCell>
                    {Array.from({ length: 52 }, (_, i) => (
                      <TableCell key={i} align="center" style={{ minWidth: 40, borderRight: '1px solid #e0e0e0' }}>
                        {i + 1}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: bancal.filas }).map((_, rowIndex) =>
                    Array.from({ length: bancal.columnas }).map((_, colIndex) => (
                      <TableRow key={`${rowIndex}-${colIndex}`}>
                        <TableCell style={{ minWidth: 80, borderRight: '1px solid #e0e0e0' }}>
                          {String.fromCharCode(65 + rowIndex)}
                          {colIndex + 1}
                        </TableCell>
                        {Array.from({ length: 52 }, (_, semanaIndex) => (
                          <TableCell
                            key={semanaIndex}
                            align="center"
                            style={{
                              minWidth: 40,
                              borderRight: '1px solid #e0e0e0',
                              backgroundColor: getCeldaContentForWeek(
                                celdasTemporales,
                                rowIndex,
                                colIndex,
                                semanaIndex + 1
                              )
                                ? '#e0f7fa'
                                : 'white',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleCeldaClick(rowIndex, colIndex, semanaIndex + 1)}
                          >
                            {getCeldaContentForWeek(
                              celdasTemporales,
                              rowIndex,
                              colIndex,
                              semanaIndex + 1
                            ) || getFaseForWeek(bancal.id_especie, semanaIndex + 1)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

      {modalOpen && (
        <PlantSelectionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSavePlant}
          selectedPlant={newPlant}
          setSelectedPlant={setNewPlant}
        />
      )}
    </Box>
  );
};

export default VistaBancal;
