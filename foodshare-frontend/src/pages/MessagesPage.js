import React from 'react';
import Layout from '../components/Layout';
import { Typography, Container, Paper } from '@mui/material';

const MessagesPage = () => {
  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Messages
          </Typography>
          <Typography variant="body1" align="center">
            Here you can view and manage your messages with other users.
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
};

export default MessagesPage;
