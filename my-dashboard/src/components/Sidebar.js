import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: '250px', backgroundColor: '#f8f9fa', height: '100vh', padding: '20px' }}>
      <List>
        <ListItem button component={NavLink} to="/" exact>
          <ListItemText primary="Resumen" />
        </ListItem>
        <ListItem button component={NavLink} to="/diseno-bancal">
          <ListItemText primary="Diseño Bancal" />
        </ListItem>
        <ListItem button component={NavLink} to="/vista-bancal">
          <ListItemText primary="Vista Bancal" />
        </ListItem>
        <ListItem button component={NavLink} to="/recursos">
          <ListItemText primary="Recursos" />
        </ListItem>
        <ListItem button component={NavLink} to="/creditos">
          <ListItemText primary="Créditos" />
        </ListItem>
        <ListItem button component={NavLink} to="/plantas-por-celda">
          <ListItemText primary="Plantas por Celda" />
        </ListItem>
        <ListItem button component={NavLink} to="/produccion-por-planta">
          <ListItemText primary="Producción por Planta" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
