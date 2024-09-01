import React, { useState } from 'react';
import { Modal, Button, Select, MenuItem, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Bancal = ({ bancal }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [grid, setGrid] = useState(
    Array(bancal.filas).fill(null).map(() => Array(bancal.columnas).fill(null))
  );
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleCellClick = (rowIndex, colIndex) => {
    setSelectedCell({ rowIndex, colIndex });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCell(null);
    setSelectedPlant('');
  };

  const handleSavePlant = () => {
    if (selectedCell) {
      const { rowIndex, colIndex } = selectedCell;
      const updatedGrid = [...grid];
      updatedGrid[rowIndex][colIndex] = selectedPlant[0]; // Guardar la inicial de la planta seleccionada
      setGrid(updatedGrid);
      handleModalClose();
    }
  };

  const addRow = () => {
    setGrid((prevGrid) => [...prevGrid, Array(prevGrid[0].length).fill(null)]);
  };

  const removeRow = () => {
    if (grid.length > 1) {
      setGrid((prevGrid) => prevGrid.slice(0, -1));
    }
  };

  const addColumn = () => {
    setGrid((prevGrid) => prevGrid.map((row) => [...row, null]));
  };

  const removeColumn = () => {
    if (grid[0].length > 1) {
      setGrid((prevGrid) => prevGrid.map((row) => row.slice(0, -1)));
    }
  };

  return (
    <div style={{ marginBottom: '20px', backgroundColor: '#f0f0f0', padding: '10px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>{bancal.nombre}</h3>
        <div>
          <Button variant="contained" color="primary" onClick={addColumn} style={{ minWidth: '40px', padding: 0 }}>
            <AddIcon />
          </Button>
        </div>
      </div>

      {/* Mostrar filas y columnas */}
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '50px' }}></div> {/* Espacio vacío para alineación de letras */}
          {[...Array(grid[0].length).keys()].map((colIndex) => (
            <div
              key={colIndex}
              style={{ width: '50px', textAlign: 'center', fontWeight: 'bold', position: 'relative' }}
              onMouseEnter={() => setHoveredColumn(colIndex)}
              onMouseLeave={() => setHoveredColumn(null)}
            >
              {hoveredColumn === colIndex && colIndex === grid[0].length - 1 ? (
                <Button onClick={removeColumn} style={{ minWidth: '40px', padding: 0, color: 'red' }}>
                  <RemoveIcon />
                </Button>
              ) : (
                colIndex + 1
              )}
            </div>
          ))}
          <Button
            onClick={addColumn}
            style={{
              minWidth: '40px',
              padding: 0,
              marginLeft: '5px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AddIcon />
          </Button>
        </div>

        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div
              style={{ width: '50px', fontWeight: 'bold', textAlign: 'center', position: 'relative' }}
              onMouseEnter={() => setHoveredRow(rowIndex)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {hoveredRow === rowIndex && rowIndex === grid.length - 1 ? (
                <Button onClick={removeRow} style={{ minWidth: '40px', padding: 0, color: 'red' }}>
                  <RemoveIcon />
                </Button>
              ) : (
                String.fromCharCode(65 + rowIndex)
              )}
            </div>
            {row.map((cell, colIndex) => (
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
                  backgroundColor: cell ? '#e0f7fa' : '#fff', // Cambiar color de fondo si hay planta seleccionada
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#e0f7fa')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = cell ? '#e0f7fa' : '#fff')}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}

        <Button
          onClick={addRow}
          style={{
            minWidth: '40px',
            padding: 0,
            marginTop: '5px',
            width: '50px',
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AddIcon />
        </Button>
      </div>

      {/* Modal para seleccionar planta */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h3>Seleccionar Planta</h3>
          <Select
            fullWidth
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Selecciona una planta
            </MenuItem>
            <MenuItem value="Tomate">Tomate</MenuItem>
            <MenuItem value="Lechuga">Lechuga</MenuItem>
            <MenuItem value="Pimiento">Pimiento</MenuItem>
          </Select>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button variant="contained" color="secondary" onClick={handleModalClose}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSavePlant}>
              Guardar
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Bancal;
