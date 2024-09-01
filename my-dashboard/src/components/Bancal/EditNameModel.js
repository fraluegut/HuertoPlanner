import React from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

const EditNameModal = ({ open, onClose, name, setName }) => {
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
          fullWidth
          variant="outlined"
          label="Nombre del Bancal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" onClick={onClose} style={{ marginTop: '20px' }}>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default EditNameModal;
