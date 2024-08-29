import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: '250px', backgroundColor: '#f8f9fa', height: '100vh', padding: '20px' }}>
      <List>
        <ListItem button component={NavLink} to="/">
          <ListItemText primary="Dashboard" />
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
      </List>
    </div>
  );
};

export default Sidebar;
