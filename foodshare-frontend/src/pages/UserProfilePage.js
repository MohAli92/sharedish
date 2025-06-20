import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import axios from '../axiosInstance';
import { useAuth } from '../context/AuthContext';

const UserProfilePage = () => {
  const { userId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserMeals = async () => {
      try {
        const res = await axios.get(`/api/meals?userId=${userId}`);
        const sortedMeals = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMeals(sortedMeals);
      } catch (err) {
        setError('Failed to load meals.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMeals();
  }, [userId]);

  if (loading || authLoading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {userId === user?._id
          ? 'My Meals'
          : `${meals[0]?.giver?.username || 'User'}'s Meals`}
      </Typography>

      {userId === user?._id && (
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/edit-profile"
          sx={{ mb: 3 }}
        >
          Edit My Profile
        </Button>
      )}

      <Grid container spacing={3}>
        {meals.map(meal => (
          <Grid item xs={12} sm={6} md={4} key={meal._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={meal.imageUrl ? `http://localhost:5000${meal.imageUrl}` : 'https://via.placeholder.com/300'}
                alt={meal.title}
              />
              <CardContent>
                <Typography variant="h6">{meal.title}</Typography>
                <Typography variant="body2">{meal.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserProfilePage;
