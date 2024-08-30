import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: '250px', backgroundColor: '#f8f9fa', height: '100vh', padding: '20px' }}>
      <List>
        {/* Corrige los atributos booleanos */}
        <ListItem button component={NavLink} to="/" exact={true}>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={NavLink} to="/diseno-bancal" exact={true}>
          <ListItemText primary="Diseño Bancal" />
        </ListItem>
        <ListItem button component={NavLink} to="/vista-bancal" exact={true}>
          <ListItemText primary="Vista Bancal" />
        </ListItem>
        <ListItem button component={NavLink} to="/recursos" exact={true}>
          <ListItemText primary="Recursos" />
        </ListItem>
        <ListItem button component={NavLink} to="/creditos" exact={true}>
          <ListItemText primary="Créditos" />
        </ListItem>
        <ListItem button component={NavLink} to="/plantas-por-celda" exact={true}>
          <ListItemText primary="Plantas por Celda" />
        </ListItem>
        <ListItem button component={NavLink} to="/produccion-por-planta" exact={true}>
          <ListItemText primary="Producción por Planta" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
