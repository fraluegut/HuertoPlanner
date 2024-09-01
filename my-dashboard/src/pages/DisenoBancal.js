import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Bancal from '../components/Bancal';

const DisenoBancal = () => {
  const [bancales, setBancales] = useState([]);

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

    fetchBancales();
  }, []);

  return (
    <div>
      <h1>Diseño de Bancal</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '0 20px', width: '100%' }}>
        {bancales.map((bancal) => (
          <div key={bancal.id_bancal} style={{ width: '100%', marginBottom: '20px', backgroundColor: '#f0f0f0', padding: '20px', marginTop: '10px' }}>
            {/* Cambié marginTop a 10px para reducir el espacio superior */}
            <Bancal bancal={bancal} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisenoBancal;
