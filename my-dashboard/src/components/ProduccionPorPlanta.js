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
  { 
    id: 1, 
    especie: 'Tomate', 
    produccionSugerida: '16-19', 
    produccionPersonalizada: '16-19', 
    kilos: '1-2', 
    unidades: '16-19', 
    terminologiaCientifica: 'Solanum lycopersicum' 
  },
  { 
    id: 2, 
    especie: 'Lechuga', 
    produccionSugerida: '1', 
    produccionPersonalizada: '1', 
    kilos: '0.3-0.5', 
    unidades: '1', 
    terminologiaCientifica: 'Lactuca sativa' 
  },
  { 
    id: 3, 
    especie: 'Cebolla', 
    produccionSugerida: '1', 
    produccionPersonalizada: '1', 
    kilos: '0.1-0.2', 
    unidades: '1', 
    terminologiaCientifica: 'Allium cepa' 
  },
];

const ProduccionPorPlanta = () => {
  const [producciones, setProducciones] = useState(initialData);
  const [selectedProduccion, setSelectedProduccion] = useState(null); // State for viewing and editing production details
  const [open, setOpen] = useState(false); // State to control modal visibility
  const [isEditing, setIsEditing] = useState(false); // State to differentiate between adding and viewing/editing

  // Functions to handle actions
  const handleEdit = (id) => {
    const produccionToEdit = producciones.find((produccion) => produccion.id === id);
    setSelectedProduccion(produccionToEdit);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setProducciones(producciones.filter((produccion) => produccion.id !== id));
  };

  const handleView = (produccion) => {
    setSelectedProduccion(produccion);
    setIsEditing(false);
    setOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduccion({
      id: producciones.length + 1,
      especie: '',
      produccionSugerida: '',
      produccionPersonalizada: '',
      kilos: '',
      unidades: '',
      terminologiaCientifica: '',
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduccion(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (isEditing) {
      const updatedProducciones = producciones.map((produccion) =>
        produccion.id === selectedProduccion.id ? selectedProduccion : produccion
      );
      if (!producciones.some((produccion) => produccion.id === selectedProduccion.id)) {
        // If it's a new entry, add it
        setProducciones([...producciones, selectedProduccion]);
      } else {
        // Otherwise, update the existing entry
        setProducciones(updatedProducciones);
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
        Añadir Producción
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Especie</TableCell>
              <TableCell>Producción por Planta (Sugerida)</TableCell>
              <TableCell>Producción por Planta (Personalizada)</TableCell>
              <TableCell>Producción en Kilos</TableCell>
              <TableCell>Producción en Unidades</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {producciones.map((produccion) => (
              <TableRow key={produccion.id}>
                <TableCell>{produccion.especie}</TableCell>
                <TableCell>{produccion.produccionSugerida}</TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={produccion.produccionPersonalizada}
                    onChange={(e) => {
                      const updatedProducciones = producciones.map((p) =>
                        p.id === produccion.id ? { ...p, produccionPersonalizada: e.target.value } : p
                      );
                      setProducciones(updatedProducciones);
                    }}
                  />
                </TableCell>
                <TableCell>{produccion.kilos}</TableCell>
                <TableCell>{produccion.unidades}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleView(produccion)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(produccion.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(produccion.id)} style={{ color: 'red' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail View and Edit Modal */}
      {selectedProduccion && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? 'Editar Producción' : 'Detalle de Producción'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Especie"
              fullWidth
              margin="normal"
              value={selectedProduccion.especie}
              onChange={(e) =>
                setSelectedProduccion({ ...selectedProduccion, especie: e.target.value })
              }
              disabled={!isEditing}
            />
            <TextField
              label="Terminología Científica"
              fullWidth
              margin="normal"
              value={selectedProduccion.terminologiaCientifica}
              onChange={(e) =>
                setSelectedProduccion({ ...selectedProduccion, terminologiaCientifica: e.target.value })
              }
              disabled={!isEditing}
            />
            <TextField
              label="Producción por Planta (Sugerida)"
              fullWidth
              margin="normal"
              value={selectedProduccion.produccionSugerida}
              onChange={(e) =>
                setSelectedProduccion({ ...selectedProduccion, produccionSugerida: e.target.value })
              }
              disabled={!isEditing}
            />
            <TextField
              label="Producción por Planta (Personalizada)"
              fullWidth
              margin="normal"
              value={selectedProduccion.produccionPersonalizada}
              onChange={(e) =>
                setSelectedProduccion({ ...selectedProduccion, produccionPersonalizada: e.target.value })
              }
              disabled={!isEditing}
            />
            <TextField
              label="Producción en Kilos"
              fullWidth
              margin="normal"
              value={selectedProduccion.kilos}
              onChange={(e) =>
                setSelectedProduccion({ ...selectedProduccion, kilos: e.target.value })
              }
              disabled={!isEditing}
            />
            <TextField
              label="Producción en Unidades"
              fullWidth
              margin="normal"
              value={selectedProduccion.unidades}
              onChange={(e) =>
                setSelectedProduccion({ ...selectedProduccion, unidades: e.target.value })
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

export default ProduccionPorPlanta;
