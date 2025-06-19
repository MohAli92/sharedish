// foodshare-frontend/src/pages/RegisterPage.js
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const countries = [
  { code: '+1', label: 'USA/Canada (+1)' },
  { code: '+20', label: 'Egypt (+20)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+49', label: 'Germany (+49)' },
];

const methods = [
  { value: 'sms', label: 'SMS' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    username: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    countryCode: Yup.string().required('Country code is required'),
    phone: Yup.string()
      .matches(/^\d{6,15}$/, 'Phone must be between 6 and 15 digits')
      .required('Phone is required'),
    password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
    method: Yup.string().required('Verification method is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      countryCode: '+1',
      phone: '',
      password: '',
      method: 'sms',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setServerError('');
      try {
        const fullPhone = values.countryCode + values.phone;

        const payload = {
          username: values.username,
          email: values.email,
          phone: fullPhone,
          password: values.password,
        };

        await axios.post('http://localhost:5000/api/auth/register', payload);

        await axios.post('http://localhost:5000/api/auth/send-otp', {
          phone: fullPhone,
          method: values.method,
        });

        navigate('/verify-phone', { state: { phone: fullPhone, method: values.method } }); // ✅ التعديل هنا
      } catch (err) {
        const msg = err.response?.data?.message || 'Registration failed';
        setServerError(msg);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Account
        </Typography>

        {serverError && <Alert severity="error">{serverError}</Alert>}

        <form onSubmit={formik.handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="normal"
            id="username"
            name="username"
            label="Name"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />

          <TextField
            fullWidth
            margin="normal"
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <FormControl fullWidth margin="normal" error={formik.touched.countryCode && Boolean(formik.errors.countryCode)}>
            <InputLabel id="countryCode-label">Country Code</InputLabel>
            <Select
              labelId="countryCode-label"
              id="countryCode"
              name="countryCode"
              value={formik.values.countryCode}
              label="Country Code"
              onChange={formik.handleChange}
            >
              {countries.map((c) => (
                <MenuItem key={c.code} value={c.code}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            id="phone"
            name="phone"
            label="Phone Number (without country code)"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />

          <FormControl fullWidth margin="normal" error={formik.touched.method && Boolean(formik.errors.method)}>
            <InputLabel id="method-label">Verification Method</InputLabel>
            <Select
              labelId="method-label"
              id="method"
              name="method"
              value={formik.values.method}
              label="Verification Method"
              onChange={formik.handleChange}
            >
              {methods.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
