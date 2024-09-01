import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Bancal from '../components/Bancal/Bancal';
import { Button } from '@mui/material';
import CreateBancalModal from '../components/Bancal/CreateBancalModal';

const DisenoBancal = () => {
  const [bancales, setBancales] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchBancales = async () => {
      try {
        const response = await axios.get('http://localhost:5000/bancales/'); // Solicitud a la API
        console.log("Datos recibidos de la API: ", response.data);
        // Supongamos que la respuesta ya incluye celdas como un campo de cada bancal
        setBancales(response.data);
      } catch (error) {
        console.error("Error al obtener bancales: ", error);
      }
    };

    fetchBancales();
  }, []);

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

  return (
    <div>
      <h1>Diseño de Bancal</h1>
      <Button variant="contained" color="primary" onClick={() => setCreateModalOpen(true)}>
        Agregar Bancal
      </Button>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '0 20px', width: '100%' }}>
        {bancales.map((bancal) => (
          <div key={bancal.id_bancal} style={{ width: '100%', marginBottom: '20px', backgroundColor: '#f0f0f0', padding: '20px', marginTop: '10px' }}>
            <Bancal bancal={bancal} onDelete={handleDeleteBancal} />
          </div>
        ))}
      </div>
      {/* Modal para crear un nuevo bancal */}
      <CreateBancalModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={handleCreateBancal} />
    </div>
  );
};

export default DisenoBancal;
