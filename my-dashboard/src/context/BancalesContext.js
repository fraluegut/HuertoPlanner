import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const BancalesContext = createContext();

export const BancalesProvider = ({ children }) => {
  const [bancales, setBancales] = useState([]);

  const fetchBancales = useCallback(async () => { 
    try {
      const response = await axios.get('http://localhost:5000/bancales'); // Asegúrate de que esta URL es correcta
      console.log('Datos recibidos de la API:', response.data);
      setBancales(response.data); 
    } catch (error) { 
      console.error('Error al obtener bancales:', error);
    }
  }, []);

  const addBancal = () => {
    const newBancal = { id: bancales.length + 1, grid: [[{ plant: null, startWeek: null, duration: 0 }]] };
    setBancales(prev => [...prev, newBancal]);
  };

  const updateBancalGrid = (bancalId, newGrid) => {
    setBancales(prevBancales => 
      prevBancales.map(bancal => 
        bancal.id === bancalId ? { ...bancal, grid: newGrid } : bancal
      )
    );
  };

  return (
    <BancalesContext.Provider value={{ bancales, setBancales, addBancal, updateBancalGrid, fetchBancales }}>
      {children}
    </BancalesContext.Provider>
  );
};

export const useBancales = () => {
  return useContext(BancalesContext);
};
