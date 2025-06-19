import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography } from '@mui/material';

const UserProfilePage = () => {
  const { userId } = useParams();

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="body1">
          User ID: {userId}
        </Typography>
      </Paper>
    </Container>
  );
};

export default UserProfilePage;
