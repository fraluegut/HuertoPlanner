import React from 'react';
import { Modal, Box, Button } from '@mui/material';

const DeleteConfirmModal = ({ open, onConfirm, onCancel }) => {
  return (
    <Modal open={open} onClose={onCancel}>
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
        <h3>¿Estás seguro de que deseas eliminar este bancal?</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button variant="contained" color="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" onClick={onConfirm}>
            Eliminar
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmModal;
