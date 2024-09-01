// src/components/Login.js

import React, { useState } from 'react';
import { Button, TextField, Card, CardContent, Typography } from '@mui/material';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validar credenciales (esto es solo para la prueba inicial)
    if (username === 'admin' && password === 'admin') {
      onLogin(); // Llamar a la función onLogin pasada desde el componente padre
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: 'auto', marginTop: '100px' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Iniciar Sesión
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Login;
