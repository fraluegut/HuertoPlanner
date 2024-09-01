import React, { useState, useEffect, useCallback } from 'react';
import { Button, IconButton, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Cell from './Cell';
import EditNameModal from './EditNameModal';
import PlantSelectionModal from './PlantSelectionModal';
import axios from 'axios';

// Definición de plantIcons
const plantIcons = {
  1: require('../../assets/icons/sandia.png'),
  2: require('../../assets/icons/tomate.png'),
  3: require('../../assets/icons/lechuga.png'),
  4: require('../../assets/icons/pimiento.png'),
};

// Definición de phaseColors
const phaseColors = {
  Siembra: '#c8e6c9',
  Germinación: '#ffcc80',
  Crecimiento: '#ffe082',
  Floración: '#f48fb1',
  Fructificación: '#ce93d8',
  Maduración: '#80cbc4',
  Cosecha: '#a5d6a7',
  Senescencia: '#b0bec5',
};

const Bancal = ({ bancal, onDelete, semanaActual, anoActual }) => {
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
    console.log('Inicializando grid...');
    const initialGrid = Array(bancal.filas)
      .fill(null)
      .map(() => Array(bancal.columnas).fill(null));
    
    console.log('Grid inicial creado:', initialGrid);
    
    if (Array.isArray(bancal.celdas)) {
      bancal.celdas.forEach(celda => {
        if (celda.semana === semanaActual && celda.ano === anoActual) {
          initialGrid[celda.fila][celda.columna] = celda;
        }
      });
    } else {
      console.warn('bancal.celdas no es un array o está indefinido', bancal.celdas);
    }

    console.log('Grid inicializado:', initialGrid);
    setGrid(initialGrid);
  }, [bancal.filas, bancal.columnas, bancal.celdas, semanaActual, anoActual]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const handleCellClick = (rowIndex, colIndex) => {
    console.log(`Clic en celda: fila ${rowIndex}, columna ${colIndex}`);
    setSelectedCell({ rowIndex, colIndex });
    setModalOpen(true);
  };

  const handleSavePlant = async (plantId) => {
    if (selectedCell) {
      const { rowIndex, colIndex } = selectedCell;
      const updatedGrid = [...grid];
      updatedGrid[rowIndex][colIndex] = { contenido: plantId, fase: 'Siembra' };

      try {
        const celda = bancal.celdas.find(
          (c) => c.fila === rowIndex && c.columna === colIndex && c.semana === semanaActual && c.ano === anoActual
        );

        console.log('Celda encontrada para actualizar o crear:', celda);

        if (celda) {
          console.log('Actualizando celda temporal existente...');
          await axios.put(`http://localhost:5000/celdas_temporales/${celda.id_celda_temporal}`, {
            contenido: plantId,
            semana: semanaActual,
            ano: anoActual,
            fase: 'Siembra',
          });
          console.log('Celda actualizada exitosamente.');
        } else {
          console.log('Creando nueva celda temporal...');
          await axios.post('http://localhost:5000/celdas_temporales/', {
            id_bancal: bancal.id_bancal,
            fila: rowIndex,
            columna: colIndex,
            contenido: plantId,
            semana: semanaActual,
            ano: anoActual,
            fase: 'Siembra',
          });
          console.log('Nueva celda creada exitosamente.');
        }

        setMessage('Celda y fases guardadas correctamente');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error al actualizar la celda:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Request data:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        setMessage('Error al guardar la celda');
        setSnackbarOpen(true);
      }

      setGrid(updatedGrid);
      setModalOpen(false);
    }
  };

  const handleDeleteBancal = async () => {
    try {
      console.log('Intentando eliminar bancal...');
      await axios.delete(`http://localhost:5000/bancales/${bancal.id_bancal}`);
      onDelete(bancal.id_bancal);
      setMessage('Bancal eliminado exitosamente');
      console.log('Bancal eliminado con éxito.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al eliminar el bancal:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
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

      console.log('Guardando cambios en bancal:', updatedBancal);

      const response = await axios.put(
        `http://localhost:5000/bancales/${bancal.id_bancal}`,
        updatedBancal
      );
      console.log('Bancal actualizado:', response.data);
      setMessage('Datos guardados correctamente');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al actualizar el bancal:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      setMessage('Error al guardar los cambios');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    console.log('Cerrando Snackbar...');
    setSnackbarOpen(false);
  };

  const addRow = () => {
    console.log('Añadiendo nueva fila al grid...');
    setGrid((prevGrid) => [...prevGrid, Array(prevGrid[0]?.length || 0).fill(null)]);
  };

  const removeRow = () => {
    if (grid.length > 1) {
      console.log('Eliminando última fila del grid...');
      setGrid((prevGrid) => prevGrid.slice(0, -1));
    } else {
      console.warn('No se puede eliminar la última fila.');
    }
  };

  const addColumn = () => {
    console.log('Añadiendo nueva columna al grid...');
    setGrid((prevGrid) => prevGrid.map((row) => [...row, null]));
  };

  const removeColumn = () => {
    if (grid[0]?.length > 1) {
      console.log('Eliminando última columna del grid...');
      setGrid((prevGrid) => prevGrid.map((row) => row.slice(0, -1)));
    } else {
      console.warn('No se puede eliminar la última columna.');
    }
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
        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
          Guardar
        </Button>
      </div>

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
              <Cell
                key={colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                content={cell ? <img src={plantIcons[cell.contenido]} alt={`Icono de ${cell.contenido}`} style={{ width: '25px', height: '25px' }} /> : ''}
                style={{ backgroundColor: cell ? phaseColors[cell.fase] : 'white' }}
              />
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
