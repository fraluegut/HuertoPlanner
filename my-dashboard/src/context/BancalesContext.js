import React, { createContext, useState, useContext } from 'react';

// Creamos el contexto
const BancalesContext = createContext();

// Creamos un hook para usar el contexto
export const useBancales = () => useContext(BancalesContext);

// Creamos un proveedor para el contexto
export const BancalesProvider = ({ children }) => {
  const [bancales, setBancales] = useState([
    {
      id: 1,
      grid: Array(3).fill(null).map(() => Array(3).fill(null)),
    },
  ]);

  const addBancal = () => {
    setBancales([...bancales, { id: bancales.length + 1, grid: Array(3).fill(null).map(() => Array(3).fill(null)) }]);
  };

  const updateBancalGrid = (id, newGrid) => {
    setBancales(
      bancales.map((bancal) => (bancal.id === id ? { ...bancal, grid: newGrid } : bancal))
    );
  };

  return (
    <BancalesContext.Provider value={{ bancales, addBancal, updateBancalGrid }}>
      {children}
    </BancalesContext.Provider>
  );
};
