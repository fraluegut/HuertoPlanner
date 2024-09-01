import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import axios from 'axios';

const PlantSelectionModal = ({ open, onClose, onSave }) => {
  const [selectedPlant, setSelectedPlant] = useState('');
  const [plantOptions, setPlantOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/especies');
        setPlantOptions(response.data);
      } catch (error) {
        console.error('Error al obtener especies:', error);
      }
    };

    fetchPlants();
  }, []);

  const handleSave = () => {
    const selectedPlantData = plantOptions.find(plant => plant.nombre === selectedPlant);

    if (selectedPlantData) {
      console.log('Planta seleccionada para guardar:', selectedPlantData);
      onSave(selectedPlantData.id_especie);  // Enviando el id de la planta seleccionada
    } else {
      console.log('No se ha seleccionado ninguna planta');
      onSave('');  // Enviar vacío si no se seleccionó ninguna planta
    }

    onClose();
  };

  const filteredPlants = plantOptions.filter((plant) =>
    plant.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal open={open} onClose={onClose}>
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
        <FormControl fullWidth>
          <InputLabel>Selecciona una planta</InputLabel>
          <Select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            displayEmpty
            renderValue={(selected) => selected || 'Selecciona una planta'}
          >
            <MenuItem value=""><em>Limpiar celda</em></MenuItem>
            {filteredPlants.map((plant) => (
              <MenuItem key={plant.id_especie} value={plant.nombre}>
                {plant.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          margin="normal"
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default PlantSelectionModal;
