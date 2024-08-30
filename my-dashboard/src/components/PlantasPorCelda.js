import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

// Initial data (can be loaded from an API or database)
const initialData = [
  { id: 1, especie: 'Tomate', plantasSugeridas: 1, plantasPersonalizadas: 1, terminologiaCientifica: 'Solanum lycopersicum' },
  { id: 2, especie: 'Lechuga', plantasSugeridas: 4, plantasPersonalizadas: 4, terminologiaCientifica: 'Lactuca sativa' },
  { id: 3, especie: 'Zanahoria', plantasSugeridas: 16, plantasPersonalizadas: 16, terminologiaCientifica: 'Daucus carota' },
];

const PlantasPorCelda = () => {
  const [plantas, setPlantas] = useState(initialData);
  const [selectedPlanta, setSelectedPlanta] = useState(null); // State for viewing and editing plant details
  const [open, setOpen] = useState(false); // State to control modal visibility
  const [isEditing, setIsEditing] = useState(false); // State to differentiate between adding and viewing/editing

  // Functions to handle actions
  const handleEdit = (id) => {
    const plantaToEdit = plantas.find((planta) => planta.id === id);
    setSelectedPlanta(plantaToEdit);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setPlantas(plantas.filter((planta) => planta.id !== id));
  };

  const handleView = (planta) => {
    setSelectedPlanta(planta);
    setIsEditing(false);
    setOpen(true);
  };

  const handleAdd = () => {
    setSelectedPlanta({
      id: plantas.length + 1,
      especie: '',
      plantasSugeridas: 0,
      plantasPersonalizadas: 0,
      terminologiaCientifica: '',
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPlanta(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (isEditing) {
      const updatedPlantas = plantas.map((planta) =>
        planta.id === selectedPlanta.id ? selectedPlanta : planta
      );
      if (!plantas.some((planta) => planta.id === selectedPlanta.id)) {
        // If it's a new plant, add it
        setPlantas([...plantas, selectedPlanta]);
      } else {
        // Otherwise, update the existing plant
        setPlantas(updatedPlantas);
      }
    }
    handleClose();
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        style={{ marginBottom: '20px' }}
      >
        Añadir Planta
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Especie</TableCell>
              <TableCell>Número de Plantas por Celda Sugerido</TableCell>
              <TableCell>Número de Plantas por Celda Personalizado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plantas.map((planta) => (
              <TableRow key={planta.id}>
                <TableCell>{planta.especie}</TableCell>
                <TableCell>{planta.plantasSugeridas}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={planta.plantasPersonalizadas}
                    onChange={(e) => {
                      const updatedPlantas = plantas.map((p) =>
                        p.id === planta.id ? { ...p, plantasPersonalizadas: e.target.value } : p
                      );
                      setPlantas(updatedPlantas);
                    }}
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleView(planta)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(planta.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(planta.id)} style={{ color: 'red' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail View and Edit Modal */}
      {selectedPlanta && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? 'Editar Planta' : 'Detalle de Especie'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Especie"
              fullWidth
              margin="normal"
              value={selectedPlanta.especie}
              onChange={(e) =>
                setSelectedPlanta({ ...selectedPlanta, especie: e.target.value })
              }
              disabled={!isEditing}
            />
            <TextField
              label="Terminología Científica"
              fullWidth
              margin="normal"
              value={selectedPlanta.terminologiaCientifica}
              onChange={(e) =>
                setSelectedPlanta({ ...selectedPlanta, terminologiaCientifica: e.target.value })
              }
              disabled={!isEditing}
            />
            <TextField
              label="Número de Plantas por Celda Sugerido"
              type="number"
              fullWidth
              margin="normal"
              value={selectedPlanta.plantasSugeridas}
              onChange={(e) =>
                setSelectedPlanta({ ...selectedPlanta, plantasSugeridas: e.target.value })
              }
              disabled={!isEditing}
            />
            <TextField
              label="Número de Plantas por Celda Personalizado"
              type="number"
              fullWidth
              margin="normal"
              value={selectedPlanta.plantasPersonalizadas}
              onChange={(e) =>
                setSelectedPlanta({ ...selectedPlanta, plantasPersonalizadas: e.target.value })
              }
              disabled={!isEditing}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cerrar
            </Button>
            {isEditing && (
              <Button onClick={handleSave} color="primary">
                Guardar
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default PlantasPorCelda;
