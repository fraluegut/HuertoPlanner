import React, { useState, useEffect, useCallback } from 'react';
import { Button, IconButton, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Cell from './Cell';
import EditNameModal from './EditNameModel';
import PlantSelectionModal from './PlantSelectionModal';
import axios from 'axios';

const Bancal = ({ bancal, onDelete }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [grid, setGrid] = useState([]);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [bancalName, setBancalName] = useState(bancal.nombre);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const initializeGrid = useCallback(() => {
    const initialGrid = Array(bancal.filas)
      .fill(null)
      .map(() => Array(bancal.columnas).fill(null));
  
    if (Array.isArray(bancal.celdas)) {
      bancal.celdas.forEach(celda => {
        // Check if fila and columna are within bounds
        if (
          celda.fila >= 0 && celda.fila < bancal.filas &&
          celda.columna >= 0 && celda.columna < bancal.columnas
        ) {
          initialGrid[celda.fila][celda.columna] = celda.contenido;
        } else {
          console.warn('Celda fuera de los límites del grid', celda);
        }
      });
    } else {
      console.warn('bancal.celdas no es un array o está indefinido', bancal.celdas);
    }
  
    setGrid(initialGrid);
  }, [bancal.filas, bancal.columnas, bancal.celdas]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const handleCellClick = (rowIndex, colIndex) => {
    setSelectedCell({ rowIndex, colIndex });
    setModalOpen(true);
  };

  const handleSavePlant = async (plant) => {
    if (selectedCell) {
      const { rowIndex, colIndex } = selectedCell;
      const updatedGrid = [...grid];
      updatedGrid[rowIndex][colIndex] = plant[0];

      try {
        const celda = bancal.celdas?.find(
          (c) => c.fila === rowIndex && c.columna === colIndex
        );
        if (celda) {
          await axios.put(`http://localhost:5000/celdas/${celda.id_celda}`, {
            contenido: plant[0],
          });
          console.log('Celda actualizada en la base de datos');
        } else {
          const response = await axios.post('http://localhost:5000/celdas/', {
            id_bancal: bancal.id_bancal,
            fila: rowIndex,
            columna: colIndex,
            contenido: plant[0],
          });
          console.log('Celda creada en la base de datos', response.data);
        }
        setMessage('Celda guardada correctamente');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error al actualizar la celda:', error);
        setMessage('Error al guardar la celda');
        setSnackbarOpen(true);
      }

      setGrid(updatedGrid);
      setModalOpen(false);
    }
  };

  const addRow = () => {
    setGrid((prevGrid) => [...prevGrid, Array(prevGrid[0]?.length || 0).fill(null)]);
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
    if (grid[0]?.length > 1) {
      setGrid((prevGrid) => prevGrid.map((row) => row.slice(0, -1)));
    }
  };

  const handleDeleteBancal = async () => {
    try {
      await axios.delete(`http://localhost:5000/bancales/${bancal.id_bancal}`);
      onDelete(bancal.id_bancal);
      setMessage('Bancal eliminado exitosamente');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al eliminar el bancal:', error);
      setMessage('Error al eliminar el bancal');
      setSnackbarOpen(true);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedBancal = {
        id_bancal: bancal.id_bancal,
        nombre: bancalName,
        filas: grid.length,
        columnas: grid[0]?.length || 0,
      };

      const response = await axios.put(
        `http://localhost:5000/bancales/${bancal.id_bancal}`,
        updatedBancal
      );
      console.log('Bancal actualizado:', response.data);
      setMessage('Datos guardados correctamente');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al actualizar el bancal:', error);
      setMessage('Error al guardar los cambios');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ marginBottom: '20px', backgroundColor: '#f0f0f0', padding: '10px', position: 'relative', marginRight: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{bancalName}</h3>
          <IconButton onClick={() => setIsEditingName(true)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDeleteBancal} size="small" color="error">
            <DeleteIcon />
          </IconButton>
        </div>
        {/* Botón para guardar los cambios */}
        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
          Guardar
        </Button>
      </div>

      {/* Mostrar filas y columnas */}
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '50px' }}></div>
          {[...Array(grid[0]?.length || 0).keys()].map((colIndex) => (
            <div
              key={colIndex}
              style={{ width: '50px', textAlign: 'center', fontWeight: 'bold', position: 'relative' }}
              onMouseEnter={() => setHoveredColumn(colIndex)}
              onMouseLeave={() => setHoveredColumn(null)}
            >
              {hoveredColumn === colIndex && colIndex === grid[0]?.length - 1 ? (
                <Button onClick={removeColumn} style={{ minWidth: '40px', padding: 0, color: 'red' }}>
                  <RemoveIcon />
                </Button>
              ) : (
                colIndex + 1
              )}
            </div>
          ))}
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

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </div>
  );
};

export default Bancal;
