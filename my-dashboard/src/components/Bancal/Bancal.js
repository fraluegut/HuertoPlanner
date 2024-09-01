import React, { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Cell from './Cell';
import EditNameModal from './EditNameModel';
import PlantSelectionModal from './PlantSelectionModal'; // Eliminamos DeleteConfirmModal

const Bancal = ({ bancal, onDelete }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [grid, setGrid] = useState(
    Array(bancal.filas).fill(null).map(() => Array(bancal.columnas).fill(null))
  );
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [bancalName, setBancalName] = useState(bancal.nombre);
  const [modalOpen, setModalOpen] = useState(false); // Eliminamos deleteConfirmOpen

  const handleCellClick = (rowIndex, colIndex) => {
    setSelectedCell({ rowIndex, colIndex });
    setModalOpen(true);
  };

  const handleSavePlant = (plant) => {
    if (selectedCell) {
      const { rowIndex, colIndex } = selectedCell;
      const updatedGrid = [...grid];
      updatedGrid[rowIndex][colIndex] = plant[0]; // Guardar la inicial de la planta seleccionada
      setGrid(updatedGrid);
      setModalOpen(false);
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

  const confirmDelete = async () => { // Usamos confirmDelete directamente
    try {
      console.log("Confirmando eliminar bancal con id:", bancal.id_bancal);
      await onDelete(bancal.id_bancal);
      console.log("Bancal eliminado.");
    } catch (error) {
      console.error("Error al eliminar el bancal:", error);
    }
  };

  return (
    <div style={{ marginBottom: '20px', backgroundColor: '#f0f0f0', padding: '10px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{bancalName}</h3>
          <IconButton onClick={() => setIsEditingName(true)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={confirmDelete} size="small" color="error">
            <DeleteIcon />
          </IconButton>
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
          {/* Botón para añadir columna */}
          <Button onClick={addColumn} style={{ minWidth: '40px', padding: 0 }}>
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
              <Cell key={colIndex} onClick={() => handleCellClick(rowIndex, colIndex)} content={cell} />
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

      {/* Modales */}
      <EditNameModal open={isEditingName} onClose={() => setIsEditingName(false)} name={bancalName} setName={setBancalName} />
      <PlantSelectionModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSavePlant} />
    </div>
  );
};

export default Bancal;
