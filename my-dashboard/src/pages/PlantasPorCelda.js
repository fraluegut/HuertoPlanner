import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const initialPlantasData = [
  { id: 1, especie: 'Tomate', recomendado: 1, personalizado: 1 },
  { id: 2, especie: 'Zanahoria', recomendado: 16, personalizado: 16 },
  { id: 3, especie: 'Lechuga', recomendado: 4, personalizado: 4 },
];

const PlantasPorCelda = () => {
  const [plantas, setPlantas] = useState(initialPlantasData);
  const [isEditing, setIsEditing] = useState(null);

  const handleEditClick = (id) => {
    setIsEditing(id);
  };

  const handleSaveClick = (id) => {
    setIsEditing(null);
  };

  const handleDeleteClick = (id) => {
    setPlantas(plantas.filter((planta) => planta.id !== id));
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setPlantas(
      plantas.map((planta) =>
        planta.id === id ? { ...planta, [name]: value } : planta
      )
    );
  };

  const handleAddEspecie = () => {
    setPlantas([...plantas, { id: plantas.length + 1, especie: '', recomendado: 0, personalizado: 0 }]);
  };

  return (
    <div>
      <h1>Plantas por Celda</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Especie</TableCell>
              <TableCell>Recomendado por Estudios</TableCell>
              <TableCell>Valor Personalizado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plantas.map((planta) => (
              <TableRow key={planta.id}>
                <TableCell>
                  {isEditing === planta.id ? (
                    <TextField
                      name="especie"
                      value={planta.especie}
                      onChange={(e) => handleInputChange(e, planta.id)}
                    />
                  ) : (
                    planta.especie
                  )}
                </TableCell>
                <TableCell style={{ color: 'grey' }}>
                  {planta.recomendado}
                </TableCell>
                <TableCell>
                  {isEditing === planta.id ? (
                    <TextField
                      name="personalizado"
                      value={planta.personalizado}
                      onChange={(e) => handleInputChange(e, planta.id)}
                    />
                  ) : (
                    planta.personalizado
                  )}
                </TableCell>
                <TableCell>
                  {isEditing === planta.id ? (
                    <Button onClick={() => handleSaveClick(planta.id)}>Guardar</Button>
                  ) : (
                    <>
                      <IconButton onClick={() => console.log('Ver detalles')}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEditClick(planta.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(planta.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" onClick={handleAddEspecie} style={{ marginTop: '20px' }}>
        Añadir Especie
      </Button>
    </div>
  );
};

export default PlantasPorCelda;
