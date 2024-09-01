// Grid.js
import React from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Cell from './Cell';

const Grid = ({ grid, handleCellClick, hoveredColumn, hoveredRow, setHoveredColumn, setHoveredRow, addRow, removeRow, addColumn, removeColumn }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '50px' }}></div>
        {[...Array(grid[0].length).keys()].map((colIndex) => (
          <div
            key={colIndex}
            style={{ width: '50px', textAlign: 'center', fontWeight: 'bold', position: 'relative' }}
            onMouseEnter={() => setHoveredColumn(colIndex)}
            onMouseLeave={() => setHoveredColumn(null)}
          >
            {hoveredColumn === colIndex && colIndex === grid[0].length - 1 ? (
              <Button onClick={removeColumn} style={{ minWidth: '40px', padding: 0, color: 'red' }}>
                <RemoveIcon />
              </Button>
            ) : (
              colIndex + 1
            )}
          </div>
        ))}
        <Button onClick={addColumn} style={{ minWidth: '40px', padding: 0 }}>
          <AddIcon />
        </Button>
      </div>

      {grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <div
            style={{ width: '50px', fontWeight: 'bold', textAlign: 'center', position: 'relative' }}
            onMouseEnter={() => setHoveredRow(rowIndex)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            {hoveredRow === rowIndex && rowIndex === grid.length - 1 ? (
              <Button onClick={removeRow} style={{ minWidth: '40px', padding: 0, color: 'red' }}>
                <RemoveIcon />
              </Button>
            ) : (
              String.fromCharCode(65 + rowIndex)
            )}
          </div>
          {row.map((cell, colIndex) => (
            <Cell key={colIndex} onClick={() => handleCellClick(rowIndex, colIndex)} content={cell} />
          ))}
        </div>
      ))}

      <Button
        onClick={addRow}
        style={{
          minWidth: '40px',
          padding: 0,
          marginTop: '5px',
          width: '50px',
          alignSelf: 'flex-start',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AddIcon />
      </Button>
    </div>
  );
};

export default Grid;
