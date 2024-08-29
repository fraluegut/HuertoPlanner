import React from 'react';
import { IconButton, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const SemanaNavigator = ({ semanaActual, setSemanaActual }) => {
  const handleSemanaAnterior = () => {
    if (semanaActual > 1) {
      setSemanaActual(semanaActual - 1);
    }
  };

  const handleSemanaSiguiente = () => {
    setSemanaActual(semanaActual + 1);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
      <IconButton onClick={handleSemanaAnterior}>
        <ArrowBack />
      </IconButton>
      <Typography variant="h6">Semana {semanaActual}</Typography>
      <IconButton onClick={handleSemanaSiguiente}>
        <ArrowForward />
      </IconButton>
    </div>
  );
};

export default SemanaNavigator;
