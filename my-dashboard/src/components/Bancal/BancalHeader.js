import React from 'react';
import { IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BancalHeader = ({ bancalName, setIsEditingName, handleDeleteBancal, handleSaveChanges }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <h3 style={{ margin: 0 }}>{bancalName}</h3>
      <IconButton onClick={() => setIsEditingName(true)} size="small">
        <EditIcon />
      </IconButton>
      <IconButton onClick={handleDeleteBancal} size="small" color="error">
        <DeleteIcon />
      </IconButton>
    </div>
    <Button variant="contained" color="primary" onClick={handleSaveChanges}>
      Guardar
    </Button>
  </div>
);

export default BancalHeader;
