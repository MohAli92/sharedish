/// ✅ TimelinePage.js - تصميم عصري + لايكات وتعليقات وترتيب زمني متكامل

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Grid,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Collapse,
} from '@mui/material';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TimelinePage = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAllMeals = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/meals');
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMeals(sorted);
      } catch (err) {
        console.error('Failed to fetch meals:', err);
        setError('Failed to fetch meals');
      } finally {
        setLoading(false);
      }
    };

    fetchAllMeals();
  }, []);

  const handleLike = async (mealId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/meals/${mealId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal._id === mealId ? { ...meal, likes: res.data.likesCount } : meal
        )
      );
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleCommentChange = (mealId, value) => {
    setComments((prev) => ({ ...prev, [mealId]: value }));
  };

  const handleAddComment = async (mealId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/meals/${mealId}/comment`,
        { text: comments[mealId] },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal._id === mealId
            ? { ...meal, comments: [...(meal.comments || []), res.data.comment] }
            : meal
        )
      );

      setComments((prev) => ({ ...prev, [mealId]: '' }));
    } catch (err) {
      console.error('Add comment failed:', err);
    }
  };

  const toggleExpand = (mealId) => {
    setExpandedCard((prev) => (prev === mealId ? null : mealId));
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Community Timeline</Typography>
      <Grid container direction="column" spacing={3}>
        {meals.map((meal) => (
          <Grid item key={meal._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="user">
                    {meal.user?.username?.charAt(0)?.toUpperCase() || '?'}
                  </Avatar>
                }
                action={
                  <IconButton onClick={() => toggleExpand(meal._id)}>
                    <ExpandMoreIcon />
                  </IconButton>
                }
                title={meal.giver?.username ?? 'Unknown User'}
                subheader={new Date(meal.createdAt).toLocaleString()}
              />
              <CardMedia
                component="img"
                height="250"
                image={`http://localhost:5000${meal.imageUrl}`}    //   image={`http://localhost:5000${meal.imageUrl}`}
                alt={meal.title}
              />
              <CardContent>
                <Typography variant="h6">{meal.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {meal.description?.slice(0, 150)}...
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton onClick={() => handleLike(meal._id)}>
                  <FavoriteIcon color="error" />
                </IconButton>
                <Typography variant="body2">{meal.likes || 0}</Typography>
                <IconButton>
                  <ShareIcon />
                </IconButton>
                <Button size="small" component={Link} to={`/meals/${meal._id}`} sx={{ marginLeft: 'auto' }}>
                  View Details
                </Button>
              </CardActions>
              <Collapse in={expandedCard === meal._id} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>Comments</Typography>
                  {(meal.comments || []).map((comment, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                      <b>{comment.user?.username || 'User'}:</b> {comment.text}
                    </Typography>
                  ))}
                  {user && (
                    <>
                      <TextField
                        fullWidth
                        multiline
                        placeholder="Write a comment..."
                        value={comments[meal._id] || ''}
                        onChange={(e) => handleCommentChange(meal._id, e.target.value)}
                        sx={{ mt: 1 }}
                      />
                      <Button onClick={() => handleAddComment(meal._id)} sx={{ mt: 1 }}>
                        Comment
                      </Button>
                    </>
                  )}
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TimelinePage;
