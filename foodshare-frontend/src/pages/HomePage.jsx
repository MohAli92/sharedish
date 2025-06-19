import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Container,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const HomePage = () => {
  const [meals, setMeals] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/meals');
        setMeals(res.data);
      } catch (err) {
        console.error('Failed to fetch meals:', err);
      }
    };
    fetchMeals();
  }, []);

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

      <Grid container spacing={3}>
        {meals.map((meal) => (
          <Grid item xs={12} sm={6} md={4} key={meal._id}>
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={meal.imageUrl || 'https://via.placeholder.com/300'}
                alt={meal.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {meal.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {meal.description?.slice(0, 100)}...
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} to={`/meals/${meal._id}`} size="small">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
