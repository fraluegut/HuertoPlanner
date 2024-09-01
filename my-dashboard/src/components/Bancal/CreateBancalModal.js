import React, { useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';

const CreateBancalModal = ({ open, onClose, onCreate }) => {
  const [nombre, setNombre] = useState('');
  const [filas, setFilas] = useState(3); // Valores por defecto
  const [columnas, setColumnas] = useState(4);

  const handleSubmit = () => {
    const newBancal = { nombre, filas, columnas };
    onCreate(newBancal); // Llamar a la función onCreate con el nuevo bancal
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
        <h3>Crear Nuevo Bancal</h3>
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Filas"
          type="number"
          value={filas}
          onChange={(e) => setFilas(parseInt(e.target.value, 10))}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Columnas"
          type="number"
          value={columnas}
          onChange={(e) => setColumnas(parseInt(e.target.value, 10))}
          fullWidth
          margin="normal"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button variant="contained" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Crear
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateBancalModal;
