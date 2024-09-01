import React, { useState } from 'react';
import { Modal, Box, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const PlantSelectionModal = ({ open, onClose, onSave }) => {
  const [selectedPlant, setSelectedPlant] = useState('');

  const handleSave = () => {
    onSave(selectedPlant);
  };

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
          <Select value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)}>
            <MenuItem value="Tomate">Tomate</MenuItem>
            <MenuItem value="Lechuga">Lechuga</MenuItem>
            <MenuItem value="Pimiento">Pimiento</MenuItem>
          </Select>
        </FormControl>
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
