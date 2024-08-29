import React from 'react';
import UserList from '../components/UserList';


const Dashboard = () => {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ flexGrow: 1, padding: '20px' }}>
          <h1>Users</h1>
          <UserList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
