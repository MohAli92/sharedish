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
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Snackbar,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/system';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DropZone = styled('div')(({ theme, isdragging }) => ({
  border: '2px dashed #aaa',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center',
  marginTop: '10px',
  cursor: 'pointer',
  backgroundColor: isdragging === 'true' ? '#f0f0f0' : 'transparent',
}));

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  location: Yup.string().required('Location is required'),
  availablePortions: Yup.number().min(1, 'At least 1 portion required').required(),
  dietaryTags: Yup.array(),
  pickupTime: Yup.date().min(new Date(), 'Pickup time must be in the future'),
});

const MealUploadPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      setSnackbar({ open: true, message: 'Only image files are allowed.', severity: 'error' });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      location: '',
      availablePortions: 1,
      dietaryTags: [],
      pickupTime: new Date(Date.now() + 3600000),
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!image) {
        return setSnackbar({ open: true, message: 'Image is required.', severity: 'error' });
      }

      setIsSubmitting(true);
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'dietaryTags') {
            formData.append(key, JSON.stringify(value));
          } else if (key === 'pickupTime') {
            formData.append(key, new Date(value).toISOString());
          } else {
            formData.append(key, value);
          }
        });
        formData.append('mealImage', image);

        const response = await axios.post('http://localhost:5000/api/meals', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(user?.token && { Authorization: `Bearer ${user.token}` }),
          },
          withCredentials: true,
        });

        setSnackbar({ open: true, message: 'Meal uploaded successfully!', severity: 'success' });

        navigate(`/profile/${user._id}`);

      } catch (error) {
        console.error('Upload error:', error);
        setSnackbar({ open: true, message: 'Failed to upload meal.', severity: 'error' });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Share a Meal</Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Meal Title" id="title" name="title"
                value={formik.values.title} onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Description" id="description" name="description"
                multiline rows={4}
                value={formik.values.description} onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth label="Location" id="location" name="location"
                value={formik.values.location} onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth label="Available Portions" type="number" id="availablePortions" name="availablePortions"
                value={formik.values.availablePortions} onChange={formik.handleChange}
                error={formik.touched.availablePortions && Boolean(formik.errors.availablePortions)}
                helperText={formik.touched.availablePortions && formik.errors.availablePortions}
              />
            </Grid>
            <Grid xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Pickup Time"
                  value={formik.values.pickupTime}
                  onChange={(val) => formik.setFieldValue('pickupTime', val)}
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
            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel id="dietary-tags-label">Dietary Tags</InputLabel>
                <Select
                  labelId="dietary-tags-label" id="dietaryTags" name="dietaryTags"
                  multiple value={formik.values.dietaryTags}
                  onChange={(e) => formik.setFieldValue('dietaryTags', e.target.value)}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Dairy-Free'].map((tag) => (
                    <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select applicable dietary tags</FormHelperText>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <DropZone
                isdragging={isDragging.toString()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('uploadInput').click()}
              >
                <Typography variant="body2">
                  {image ? image.name : 'Drag and drop image here or click to select'}
                </Typography>
              </DropZone>
              <input
                id="uploadInput"
                type="file"
                hidden accept="image/*"
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
            </Grid>
            <Grid xs={12}>
              <Button
                type="submit" variant="contained" color="primary"
                fullWidth sx={{ py: 2 }} disabled={isSubmitting}
              >
                {isSubmitting ? 'Sharing...' : 'Share Meal'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MealUploadPage;
