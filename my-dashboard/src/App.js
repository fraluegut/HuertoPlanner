// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import DisenoBancal from './pages/DisenoBancal';
import VistaBancal from './pages/VistaBancal';
import Recursos from './pages/Recursos';
import Creditos from './pages/Creditos';
import { BancalesProvider } from './context/BancalesContext';
import PlantasPorCelda from './components/PlantasPorCelda';
import ProduccionPorPlanta from './components/ProduccionPorPlanta';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <BancalesProvider>
      <Router>
        <div>
          {isAuthenticated ? (
            <>
              <TopBar onLogout={handleLogout} />
              <div style={{ display: 'flex', marginTop: '64px' }}>
                <Sidebar />
                <div style={{ flexGrow: 1, padding: '20px' }}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/diseno-bancal" element={<DisenoBancal />} />
                    <Route path="/vista-bancal" element={<VistaBancal />} />
                    <Route path="/recursos" element={<Recursos />} />
                    <Route path="/creditos" element={<Creditos />} />
                    <Route path="/plantas-por-celda" element={<PlantasPorCelda />} />
                    <Route path="/produccion-por-planta" element={<ProduccionPorPlanta />} />
                  </Routes>
                </div>
              </div>
            </>
          ) : (
            <Login onLogin={handleLogin} />
          )}
        </div>
      </Router>
    </BancalesProvider>
  );
}

export default App;
