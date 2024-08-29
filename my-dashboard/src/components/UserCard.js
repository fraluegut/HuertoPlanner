import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';

const UserCard = ({ user }) => {
  return (
    <Card variant="outlined" style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h6">{user.name}</Typography>
        <Typography color="textSecondary">{user.company}</Typography>
        <Typography variant="body2">{user.role}</Typography>
        <Typography variant="body2">
          Verified: {user.verified ? 'Yes' : 'No'}
        </Typography>
        <Chip label={user.status} color={user.status === 'Active' ? 'success' : 'error'} />
      </CardContent>
    </Card>
  );
};

export default UserCard;
