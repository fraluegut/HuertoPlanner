import React, { useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';

const EditNameModal = ({ open, onClose, name, setName }) => {
  const [newName, setNewName] = useState(name);

  const handleSave = () => {
    setName(newName);
    onClose();
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
        <TextField
          label="Nuevo nombre del bancal"
          fullWidth
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
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

export default EditNameModal;
