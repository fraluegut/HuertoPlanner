import React, { useState } from 'react';
import { Button } from '@mui/material';
import Bancal from '../components/Bancal';
import SemanaNavigator from '../components/SemanaNavigator';
import { useBancales } from '../context/BancalesContext';

const DisenoBancal = () => {
  const { bancales, addBancal } = useBancales();
  const [semanaActual, setSemanaActual] = useState(1);

  return (
    <div>
      <h1>Diseño de Bancal</h1>
      {/* Agregamos el componente de navegación de semanas */}
      <SemanaNavigator semanaActual={semanaActual} setSemanaActual={setSemanaActual} />
      <div>
        {bancales.map((bancal) => (
          <div key={bancal.id} style={{ marginBottom: '20px' }}>
            <Bancal bancal={bancal} semanaActual={semanaActual} />
          </div>
        ))}
      </div>
      <Button onClick={addBancal} variant="contained" color="primary">
        Añadir Bancal
      </Button>
    </div>
  );
};

export default DisenoBancal;
