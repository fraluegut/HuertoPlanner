import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import DisenoBancal from './pages/DisenoBancal';
import VistaBancal from './pages/VistaBancal';
import Recursos from './pages/Recursos';
import Creditos from './pages/Creditos';
import { BancalesProvider } from './context/BancalesContext'; // Importamos el proveedor
import PlantasPorCelda from './components/PlantasPorCelda'; // Importar la nueva página
import ProduccionPorPlanta from './components/ProduccionPorPlanta'; // Import the new page

function App() {
  return (
    <BancalesProvider>
      <Router>
        <div>
          <TopBar />
          <div style={{ display: 'flex', marginTop: '64px' }}>
            <Sidebar />
            <div style={{ flexGrow: 1, padding: '20px' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/diseno-bancal" element={<DisenoBancal />} />
                <Route path="/vista-bancal" element={<VistaBancal />} />
                <Route path="/recursos" element={<Recursos />} />
                <Route path="/creditos" element={<Creditos />} />
                {/* Nueva ruta para la página Plantas por Celda */}
                <Route path="/plantas-por-celda" element={<PlantasPorCelda />} />
                <Route path="/produccion-por-planta" element={<ProduccionPorPlanta />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </BancalesProvider>
  );
}

export default App;
