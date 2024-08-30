// BancalesContext.js
import React, { createContext, useState, useContext } from 'react';

const BancalesContext = createContext();

export const BancalesProvider = ({ children }) => {
  const [bancales, setBancales] = useState([]);

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
    <BancalesContext.Provider value={{ bancales, setBancales, addBancal, updateBancalGrid }}>
      {children}
    </BancalesContext.Provider>
  );
};

export const useBancales = () => {
  return useContext(BancalesContext);
};
