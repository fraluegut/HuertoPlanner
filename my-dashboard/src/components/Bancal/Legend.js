import React from 'react';

const Legend = ({ phaseColors }) => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
    {Object.entries(phaseColors).map(([phase, color]) => (
      <div key={phase} style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '20px', height: '20px', backgroundColor: color, marginRight: '5px' }}></div>
        <span>{phase}</span>
      </div>
    ))}
  </div>
);

export default Legend;
