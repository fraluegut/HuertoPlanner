import React, { useState } from 'react';
import { Button, Select, MenuItem, TextField } from '@mui/material'; // Importa TextField
import { Add as AddIcon } from '@mui/icons-material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { useBancales } from '../context/BancalesContext';

const Bancal = ({ bancal, semanaActual }) => {
  const { updateBancalGrid } = useBancales();
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [growthDuration, setGrowthDuration] = useState(3); // Utiliza growthDuration

  const addColumn = () => {
    const newGrid = bancal.grid.map(row => [...row, { plant: null, startWeek: null, duration: 0 }]);
    updateBancalGrid(bancal.id, newGrid);
  };

  const addRow = () => {
    const newGrid = [...bancal.grid, Array(bancal.grid[0].length).fill({ plant: null, startWeek: null, duration: 0 })];
    updateBancalGrid(bancal.id, newGrid);
  };

  const handleCellClick = (rowIndex, colIndex) => {
    setSelectedCell({ rowIndex, colIndex });
  };

  const handlePlantSelect = (event) => {
    setSelectedPlant(event.target.value);
  };

  const handleSavePlant = () => {
    if (selectedCell) {
      const { rowIndex, colIndex } = selectedCell;
      const updatedGrid = bancal.grid.map((row, rIdx) =>
        row.map((cell, cIdx) => 
          rIdx === rowIndex && cIdx === colIndex 
            ? { plant: selectedPlant, startWeek: semanaActual, duration: growthDuration } 
            : cell
        )
      );
      updateBancalGrid(bancal.id, updatedGrid);
      setSelectedCell(null);
      setSelectedPlant('');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Grid del bancal */}
      <div>
        {bancal.grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => {
              const isPlanted = cell.plant && (semanaActual >= cell.startWeek) && (semanaActual < cell.startWeek + cell.duration);
              return (
                <div
                  key={colIndex}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  style={{
                    width: '50px',
                    height: '50px',
                    border: '1px solid #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: selectedCell?.rowIndex === rowIndex && selectedCell?.colIndex === colIndex ? '#e0f7fa' : 'white',
                  }}
                >
                  {isPlanted ? <LocalFloristIcon /> : null}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ marginTop: '10px' }}>
          <Button onClick={addRow} startIcon={<AddIcon />}>
            Añadir Fila
          </Button>
          <Button onClick={addColumn} startIcon={<AddIcon />} style={{ marginLeft: '10px' }}>
            Añadir Columna
          </Button>
        </div>
      </div>

      {/* Panel de selección */}
      {selectedCell && (
        <div style={{ marginLeft: '20px' }}>
          <h3>Selecciona una Planta</h3>
          <Select value={selectedPlant} onChange={handlePlantSelect} displayEmpty fullWidth>
            <MenuItem value="" disabled>
              Selecciona una planta
            </MenuItem>
            <MenuItem value="tomato">Tomate</MenuItem>
            {/* Puedes agregar más opciones aquí */}
          </Select>
          {/* Agrega un campo para seleccionar la duración del crecimiento */}
          <TextField
            label="Duración del Crecimiento (semanas)"
            type="number"
            value={growthDuration}
            onChange={(e) => setGrowthDuration(Number(e.target.value))}
            fullWidth
            style={{ marginTop: '10px' }}
          />
          <Button onClick={handleSavePlant} variant="contained" color="primary" style={{ marginTop: '10px' }}>
            Guardar
          </Button>
        </div>
      )}
    </div>
  );
};

export default Bancal;
