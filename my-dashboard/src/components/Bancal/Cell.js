import React from 'react';

const Cell = ({ content, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: '50px',
        height: '50px',
        border: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: content ? '#e0f7fa' : '#fff',
        transition: 'background-color 0.3s ease',
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = content ? '#c8e6c9' : '#f1f8e9')}
      onMouseLeave={(e) => (e.target.style.backgroundColor = content ? '#e0f7fa' : '#fff')}
    >
      {content}
    </div>
  );
};

export default Cell;
