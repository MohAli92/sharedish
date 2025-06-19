import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  location: Yup.string().required('Location is required'),
  availablePortions: Yup.number().min(1, 'At least 1 portion required'),
  dietaryTags: Yup.array(),
  pickupTime: Yup.date().min(new Date(), 'Pickup time must be in the future'),
  isFree: Yup.boolean(),
  price: Yup.number().when('isFree', {
    is: false,
    then: Yup.number().min(1, 'Price must be at least 1'),
  }),
});

const MealUploadPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      location: '',
      availablePortions: 1,
      dietaryTags: [],
      pickupTime: new Date(Date.now() + 3600000),
      isFree: true,
      price: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('location', values.location);
        formData.append('availablePortions', values.availablePortions);
        formData.append('dietaryTags', JSON.stringify(values.dietaryTags));
        formData.append('pickupTime', values.pickupTime.toISOString());
        formData.append('isFree', values.isFree);
        formData.append('price', values.price);
        if (image) {
          formData.append('mealImage', image);
        }

        const response = await axios.post('/api/meals', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentUser.token}`,
          },
        });

        navigate(`/meals/${response.data._id}`);
      } catch (error) {
        console.error('Error uploading meal:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Share a Meal
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Meal Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="location"
                name="location"
                label="Pickup Location"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="availablePortions"
                name="availablePortions"
                label="Available Portions"
                type="number"
                value={formik.values.availablePortions}
                onChange={formik.handleChange}
                error={formik.touched.availablePortions && Boolean(formik.errors.availablePortions)}
                helperText={formik.touched.availablePortions && formik.errors.availablePortions}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Pickup Time"
                  value={formik.values.pickupTime}
                  onChange={(date) => formik.setFieldValue('pickupTime', date)}
                  minDateTime={new Date()}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={formik.touched.pickupTime && Boolean(formik.errors.pickupTime)}
                      helperText={formik.touched.pickupTime && formik.errors.pickupTime}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="dietary-tags-label">Dietary Tags</InputLabel>
                <Select
                  labelId="dietary-tags-label"
                  id="dietaryTags"
                  name="dietaryTags"
                  multiple
                  value={formik.values.dietaryTags}
                  onChange={(e) => formik.setFieldValue('dietaryTags', e.target.value)}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Dairy-Free'].map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select applicable dietary tags</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <Typography component="legend">Is this meal free?</Typography>
                <Box display="flex" alignItems="center">
                  <Button
                    variant={formik.values.isFree ? 'contained' : 'outlined'}
                    onClick={() => formik.setFieldValue('isFree', true)}
                    sx={{ mr: 2 }}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={!formik.values.isFree ? 'contained' : 'outlined'}
                    onClick={() => formik.setFieldValue('isFree', false)}
                  >
                    No
                  </Button>
                </Box>
              </FormControl>
            </Grid>
            {!formik.values.isFree && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="price"
                  name="price"
                  label="Price per portion"
                  type="number"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <input
                accept="image/*"
                id="meal-image-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <label htmlFor="meal-image-upload">
                <Button variant="contained" component="span" sx={{ mr: 2 }}>
                  Upload Image
                </Button>
              </label>
              {image && <Typography variant="body2">{image.name}</Typography>}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ width: '100%', py: 2 }}
              >
                {isSubmitting ? 'Sharing...' : 'Share Meal'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default MealUploadPage;
