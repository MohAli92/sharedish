import React from 'react';
import {
  Typography,
  Button,
  Container,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ color: 'white' }}>
        Welcome to ShareDish
      </Typography>
      <Typography variant="h6" align="center" gutterBottom sx={{ color: '#e0e0e0' }}>
        Share meals, reduce waste, and connect with your community.
      </Typography>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        {user ? (
          <Button
            component={Link}
            to="/upload-meal"
            variant="contained"
            color="primary"
          >
            Upload a Meal
          </Button>
        ) : (
          <>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{ mx: 1, color: 'white', borderColor: 'white' }}
            >
              Login
            </Button>
            <Button component={Link} to="/register" variant="contained" sx={{ mx: 1 }}>
              Register
            </Button>
          </>
        )}
      </div>
    </Container>
  );
};

export default HomePage;
