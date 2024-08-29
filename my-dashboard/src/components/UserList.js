import React from 'react';
import UserCard from './UserCard';

const users = [
  { name: 'Adam Trantow', company: 'Mohr, Langworth and Hills', role: 'UI Designer', verified: true, status: 'Active' },
  { name: 'Angel Rolfson-Kulas', company: 'Koch and Sons', role: 'UI Designer', verified: true, status: 'Active' },
  { name: 'Betty Hammes', company: 'Waelchi - VonRueden', role: 'UI Designer', verified: true, status: 'Active' },
  { name: 'Billy Braun', company: 'White, Cassin and Goldner', role: 'UI Designer', verified: false, status: 'Banned' },
  { name: 'Billy Stoltenberg', company: 'Medhurst, Moore and Franey', role: 'Leader', verified: true, status: 'Banned' }
];

const UserList = () => {
  return (
    <div>
      {users.map((user, index) => (
        <UserCard key={index} user={user} />
      ))}
    </div>
  );
};

export default UserList;
