import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useBancales } from '../context/BancalesContext';

const VistaBancal = () => {
  // Use the context to access the current state of bancales
  const { bancales } = useBancales();

  return (
    <Box p={2}>
      <h2 style={{ textAlign: 'center' }}>Vista Bancal</h2>
      {/* Check if bancales exists and is an array */}
      {Array.isArray(bancales) && bancales.map((bancal) => (
        // Ensure bancal and bancal.grid are valid
        bancal && Array.isArray(bancal.grid) ? (
          <Box key={bancal.id} mb={4}>
            <h3>{bancal.nombre}</h3>
            <TableContainer component={Paper} style={{ overflowX: 'auto', maxHeight: '600px' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ minWidth: 80 }}>Celda</TableCell>
                    {/* Create 52 columns for each week */}
                    {Array.from({ length: 52 }, (_, i) => (
                      <TableCell key={i} align="center" style={{ minWidth: 40 }}>
                        {i + 1}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bancal.grid.map((row, rowIndex) =>
                    // Ensure row is an array
                    Array.isArray(row) && row.map((cell) =>
                      // Ensure cell is not undefined or null
                      cell ? (
                        <TableRow key={cell.id}>
                          <TableCell style={{ minWidth: 80 }}>{cell.id}</TableCell>
                          {Array.isArray(cell.semanas) && cell.semanas.map((semana, semanaIndex) => (
                            <TableCell
                              key={semanaIndex}
                              align="center"
                              style={{
                                minWidth: 40,
                                backgroundColor: semana ? '#e0f7fa' : 'white', // Highlight weeks with plants
                              }}
                            >
                              {semana ? cell.planta : ''}
                            </TableCell>
                          ))}
                        </TableRow>
                      ) : null
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : null
      ))}
    </Box>
  );
};

export default VistaBancal;
