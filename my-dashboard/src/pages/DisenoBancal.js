import { useState, useEffect } from 'react';
import axios from 'axios';
import Bancal from '../components/Bancal/Bancal';
import { Button } from '@mui/material';
import CreateBancalModal from '../components/Bancal/CreateBancalModal';
import { getWeek, getYear } from 'date-fns';

const DisenoBancal = () => {
  const [bancales, setBancales] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [semanaActual, setSemanaActual] = useState(getWeek(new Date()));
  const [anoActual, setAnoActual] = useState(getYear(new Date()));
  const [especieFases, setEspecieFases] = useState({});

  useEffect(() => {
    const fetchBancales = async () => {
      try {
        const response = await axios.get('http://localhost:5000/bancales/');
        console.log("Datos recibidos de la API (Bancales):", response.data);
        setBancales(response.data);
      } catch (error) {
        console.error("Error al obtener bancales: ", error);
      }
    };

    fetchBancales();
  }, []);

  const handleFetchEspecieFases = async (especieId) => {
    try {
      const response = await axios.get(`http://localhost:5000/plantas_fases/${especieId}`);
      console.log(`Fases recibidas para especie ID ${especieId}:`, response.data);
      setEspecieFases((prevFases) => ({
        ...prevFases,
        [especieId]: response.data
      }));
    } catch (error) {
      console.error("Error al obtener fases de la especie: ", error);
    }
  };

  const handleSavePlant = async (plant, bancal, rowIndex, colIndex) => {
    try {
      // Primero, obtén las fases de la especie si aún no se han obtenido
      if (!especieFases[plant.id]) {
        await handleFetchEspecieFases(plant.id);
      }

      // Aquí puedes agregar la lógica para guardar la planta en la celda temporalmente
      const response = await axios.post('http://localhost:5000/celdas_temporales', {
        id_bancal: bancal.id_bancal,
        fila: rowIndex,
        columna: colIndex,
        contenido: plant.nombre,
        semana: semanaActual,
        ano: anoActual
      });

      console.log('Celda temporal creada/actualizada:', response.data);

    } catch (error) {
      console.error('Error al guardar la planta en la celda temporal:', error);
    }
  };

  const handleDeleteBancal = async (bancalId) => {
    try {
      await axios.delete(`http://localhost:5000/bancales/${bancalId}`);
      setBancales((prevBancales) => prevBancales.filter(bancal => bancal.id_bancal !== bancalId));
      console.log(`Bancal con id ${bancalId} eliminado.`);
    } catch (error) {
      console.error("Error al eliminar bancal:", error);
    }
  };

  const handleCreateBancal = async (newBancal) => {
    try {
      const response = await axios.post('http://localhost:5000/bancales/', newBancal);
      setBancales((prevBancales) => [...prevBancales, { ...newBancal, id_bancal: response.data.id_bancal }]);
      console.log('Nuevo bancal creado:', response.data);
    } catch (error) {
      console.error('Error al crear un nuevo bancal:', error);
    }
    setCreateModalOpen(false);
  };

  const cambiarSemana = (cambio) => {
    let nuevaSemana = semanaActual + cambio;
    let nuevoAno = anoActual;

    if (nuevaSemana < 1) {
      nuevaSemana = 52; // o 53 dependiendo del año
      nuevoAno -= 1;
    } else if (nuevaSemana > 52) { // o 53 dependiendo del año
      nuevaSemana = 1;
      nuevoAno += 1;
    }

    setSemanaActual(nuevaSemana);
    setAnoActual(nuevoAno);
  };

  return (
    <div>
      <h1>Diseño de Bancal</h1>
      <Button variant="contained" color="primary" onClick={() => setCreateModalOpen(true)}>
        Agregar Bancal
      </Button>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
        <Button onClick={() => cambiarSemana(-1)}>Semana Anterior</Button>
        <div style={{ margin: '0 20px' }}>
          Semana: {semanaActual} | Año: {anoActual}
        </div>
        <Button onClick={() => cambiarSemana(1)}>Semana Siguiente</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '0 20px', width: '100%' }}>
        {bancales.map((bancal) => (
          <div key={bancal.id_bancal} style={{ width: '100%', marginBottom: '20px', backgroundColor: '#f0f0f0', padding: '20px', marginTop: '10px' }}>
            <Bancal
              bancal={bancal}
              onDelete={handleDeleteBancal}
              semanaActual={semanaActual}
              anoActual={anoActual}
              onSavePlant={(plant, rowIndex, colIndex) => handleSavePlant(plant, bancal, rowIndex, colIndex)}
              especieFases={especieFases[bancal.id_especie]}
            />
          </div>
        ))}
      </div>

      <CreateBancalModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={handleCreateBancal} />
    </div>
  );
};

export default DisenoBancal;
