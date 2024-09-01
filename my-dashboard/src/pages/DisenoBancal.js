import { useState, useEffect } from 'react';
import axios from 'axios';
import Bancal from '../components/Bancal/Bancal';
import { Button } from '@mui/material';
import CreateBancalModal from '../components/Bancal/CreateBancalModal';
import { getWeek, getYear } from 'date-fns'; // Asegúrate de importar correctamente

const DisenoBancal = () => {
  const [bancales, setBancales] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [semanaActual, setSemanaActual] = useState(getWeek(new Date())); // Usa getWeek aquí
  const [anoActual, setAnoActual] = useState(getYear(new Date())); // Usa getYear aquí
  const [celdasTemporales, setCeldasTemporales] = useState([]);

  // Efecto para cargar los bancales y las celdas temporales al iniciar el componente o al cambiar de semana/año
  useEffect(() => {
    const fetchBancales = async () => {
      try {
        const response = await axios.get('http://localhost:5000/bancales/'); // Solicitud a la API
        console.log("Datos recibidos de la API: ", response.data);
        setBancales(response.data);
      } catch (error) {
        console.error("Error al obtener bancales: ", error);
      }
    };

    const fetchCeldasTemporales = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/celdas_temporales?semana=${semanaActual}&ano=${anoActual}`);
        console.log("Celdas temporales recibidas de la API: ", response.data);
        setCeldasTemporales(response.data);
      } catch (error) {
        console.error("Error al obtener celdas temporales: ", error);
      }
    };

    fetchBancales();
    fetchCeldasTemporales();
  }, [semanaActual, anoActual]); // Dependencias para recargar datos cuando cambian la semana o el año

  const handleCreateBancal = async (newBancal) => {
    try {
      const response = await axios.post('http://localhost:5000/bancales/', newBancal);
      console.log("Bancal creado:", response.data);
      setBancales((prevBancales) => [...prevBancales, { ...newBancal, id_bancal: response.data.id_bancal }]);
    } catch (error) {
      console.error("Error al crear el bancal:", error);
    }
    setCreateModalOpen(false);
  };

  const handleDeleteBancal = async (bancalId) => {
    try {
      await axios.delete(`http://localhost:5000/bancales/${bancalId}`);
      console.log(`Bancal con id ${bancalId} eliminado de la API.`);
      setBancales((prevBancales) => prevBancales.filter((b) => b.id_bancal !== bancalId));
    } catch (error) {
      console.error("Error al eliminar bancal:", error);
    }
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
              celdasTemporales={celdasTemporales.filter(celda => celda.id_bancal === bancal.id_bancal)}
            />
          </div>
        ))}
      </div>

      <CreateBancalModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={handleCreateBancal} />
    </div>
  );
};

export default DisenoBancal;
