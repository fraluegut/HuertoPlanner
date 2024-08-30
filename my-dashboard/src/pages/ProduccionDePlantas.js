import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';

// Datos iniciales de ejemplo
const initialData = [
  { 
    id: 1, 
    especie: 'Tomate', 
    produccionPorPlanta: 4, 
    tiempoGerminacion: 2, 
    tiempoMadurar: 5, 
    tiempoCosecha: 3 
  },
  { 
    id: 2, 
    especie: 'Zanahoria', 
    produccionPorPlanta: 0.5, 
    tiempoGerminacion: 1, 
    tiempoMadurar: 8, 
    tiempoCosecha: 2 
  },
  { 
    id: 3, 
    especie: 'Lechuga', 
    produccionPorPlanta: 0.3, 
    tiempoGerminacion: 1, 
    tiempoMadurar: 4, 
    tiempoCosecha: 1 
  },
];

const ProduccionDePlantas = () => {
  const [rows, setRows] = useState(initialData);

  // Manejar cambios en la edición de la tabla
  const handleInputChange = (id, field, value) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  // Añadir una nueva fila a la tabla
  const addRow = () => {
    const newId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 1;
    setRows([...rows, { 
      id: newId, 
      especie: '', 
      produccionPorPlanta: '', 
      tiempoGerminacion: '', 
      tiempoMadurar: '', 
      tiempoCosecha: '' 
    }]);
  };

  return (
    <div>
      <h1>Producción de Plantas</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Especie</TableCell>
              <TableCell>Producción por Planta (kg)</TableCell>
              <TableCell>Tiempo de Germinación (semanas)</TableCell>
              <TableCell>Tiempo hasta Madurar (semanas)</TableCell>
              <TableCell>Tiempo de Cosecha (semanas)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <TextField
                    value={row.especie}
                    onChange={(e) => handleInputChange(row.id, 'especie', e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.produccionPorPlanta}
                    onChange={(e) => handleInputChange(row.id, 'produccionPorPlanta', e.target.value)}
                    type="number"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.tiempoGerminacion}
                    onChange={(e) => handleInputChange(row.id, 'tiempoGerminacion', e.target.value)}
                    type="number"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.tiempoMadurar}
                    onChange={(e) => handleInputChange(row.id, 'tiempoMadurar', e.target.value)}
                    type="number"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.tiempoCosecha}
                    onChange={(e) => handleInputChange(row.id, 'tiempoCosecha', e.target.value)}
                    type="number"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={addRow} variant="contained" color="primary" style={{ marginTop: '20px' }}>
        Añadir Especie
      </Button>
    </div>
  );
};

export default ProduccionDePlantas;
