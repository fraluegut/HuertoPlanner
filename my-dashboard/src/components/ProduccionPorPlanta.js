import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const ProduccionPorPlanta = () => {
  const [producciones, setProducciones] = useState([]);
  const [selectedProduccion, setSelectedProduccion] = useState(null);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Obtener producciones al montar el componente
  useEffect(() => {
    fetchProducciones();
  }, []);

  // Función para obtener las producciones desde la API
  const fetchProducciones = async () => {
    try {
      const response = await axios.get('http://localhost:5000/produccion/');
      console.log("Datos recibidos de la API:", response.data); // Verifica los datos recibidos
      setProducciones(response.data); // Guardar los datos en el estado
    } catch (error) {
      console.error("Error al obtener las producciones:", error);
      console.log(error.response);  // Mostrar detalles del error si existe
    }
  };

  // Función para agregar o actualizar producción
  const saveProduccion = async (produccion) => {
    try {
      if (produccion.id_produccion) {
        // Actualizar producción existente
        await axios.put(`http://localhost:5000/produccion/${produccion.id_produccion}`, produccion);
      } else {
        // Agregar nueva producción
        await axios.post('http://localhost:5000/produccion/', produccion);
      }
      fetchProducciones(); // Actualizar la lista de producciones
      handleClose(); // Cerrar el modal
    } catch (error) {
      console.error("Error al guardar la producción:", error);
    }
  };

  // Función para eliminar producción
  const deleteProduccion = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/produccion/${id}`);
      fetchProducciones(); // Actualizar la lista de producciones
    } catch (error) {
      console.error("Error al eliminar la producción:", error);
    }
  };

  const handleEdit = (id) => {
    const produccionToEdit = producciones.find((produccion) => produccion.id_produccion === id);
    setSelectedProduccion(produccionToEdit);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id) => {
    deleteProduccion(id);
  };

  const handleView = (produccion) => {
    setSelectedProduccion(produccion);
    setIsEditing(false);
    setOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduccion({
      id_produccion: null,
      id_especie: '',
      produccion_por_planta_kg: '',
      produccion_por_planta_unidades: '',
      produccion_personalizada_por_planta_kg: '',
      produccion_personalizada_por_planta_unidades: ''
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleSave = () => {
    if (selectedProduccion) {
      // Verificar que todos los campos requeridos están presentes
      if (!selectedProduccion.id_especie) {
        alert('El campo "Especie" es requerido.');
        return;
      }
      saveProduccion(selectedProduccion);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduccion(null);
    setIsEditing(false);
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
              <TableRow key={produccion.id_produccion}>
                <TableCell>{produccion.id_especie}</TableCell>
                <TableCell>{produccion.produccion_por_planta_kg}</TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={produccion.produccion_personalizada_por_planta_kg}
                    onChange={(e) => {
                      const updatedProducciones = producciones.map((p) =>
                        p.id_produccion === produccion.id_produccion ? { ...p, produccion_personalizada_por_planta_kg: e.target.value } : p
                      );
                      setProducciones(updatedProducciones);
                    }}
                  />
                </TableCell>
                <TableCell>{produccion.produccion_por_planta_unidades}</TableCell>
                <TableCell>{produccion.produccion_personalizada_por_planta_unidades}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleView(produccion)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(produccion.id_produccion)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(produccion.id_produccion)} style={{ color: 'red' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para Ver o Editar Detalles */}
      {selectedProduccion && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? 'Editar Producción' : 'Detalle de Producción'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Especie"
              fullWidth
              margin="normal"
              value={selectedProduccion.id_especie}
              onChange={(e) =>
                setSelectedProduccion({ ...selectedProduccion, id_especie: e.target.value })
              }
              disabled={!isEditing}
            />
            <TextField
              label="Producción por Planta (Sugerida)"
              fullWidth
              margin="normal"
              value={selectedProduccion.produccion_por_planta_kg}
              onChange={(e) =>
                setSelectedProduccion({ ...selectedProduccion, produccion_por_planta_kg: e.target.value })
              }
              disabled={!isEditing}
            />
            <TextField
              label="Producción por Planta (Personalizada)"
              fullWidth
              margin="normal"
              value={selectedProduccion.produccion_personalizada_por_planta_kg}
              onChange={(e) =>
                setSelectedProduccion({ ...selectedProduccion, produccion_personalizada_por_planta_kg: e.target.value })
              }
              disabled={!isEditing}
            />
            <TextField
              label="Producción en Kilos"
              fullWidth
              margin="normal"
              value={selectedProduccion.produccion_por_planta_unidades}
              onChange={(e) =>
                setSelectedProduccion({ ...selectedProduccion, produccion_por_planta_unidades: e.target.value })
              }
              disabled={!isEditing}
            />
            <TextField
              label="Producción en Unidades"
              fullWidth
              margin="normal"
              value={selectedProduccion.produccion_personalizada_por_planta_unidades}
              onChange={(e) =>
                setSelectedProduccion({ ...selectedProduccion, produccion_personalizada_por_planta_unidades: e.target.value })
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
