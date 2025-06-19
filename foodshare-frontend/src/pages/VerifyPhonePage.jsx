import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Snackbar,
  Stack,
  IconButton,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const VerifyPhonePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone || '';
  const methodFromRegister = location.state?.method || 'sms';
  const [method, setMethod] = useState(methodFromRegister);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // ✅ Snackbar states
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('success');

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendOtp = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/send-otp', {
        phone,
        method,
      });
      setSnackMessage(res.data.message || 'OTP sent!');
      setSnackSeverity('success');
      setSnackOpen(true);
      setCooldown(30);
    } catch (err) {
      setSnackMessage(err.response?.data?.message || 'Failed to send OTP');
      setSnackSeverity('error');
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        phone,
        code,
      });
      setSnackMessage(res.data.message || 'Phone verified!');
      setSnackSeverity('success');
      setSnackOpen(true);
      navigate('/login');
    } catch (err) {
      setSnackMessage(err.response?.data?.message || 'Verification failed');
      setSnackSeverity('error');
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Verify Your Phone Number
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          We sent an OTP to: <strong>{phone}</strong>
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="method-label">Send via</InputLabel>
          <Select
            labelId="method-label"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            label="Send via"
          >
            <MenuItem value="sms">SMS</MenuItem>
            <MenuItem value="whatsapp">WhatsApp</MenuItem>
          </Select>
        </FormControl>

        {method === 'whatsapp' && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              border: '1px solid #1976d2',
              borderRadius: 2,
              backgroundColor: '#e3f2fd',
            }}
          >
            <Typography variant="body2" sx={{ mb: 2 }}>
              To receive the code via WhatsApp, send <strong>join government-think</strong> to <strong>+14155238886</strong> first.
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="#f5f5f5"
              borderRadius={2}
              px={2}
              py={1}
              sx={{ mb: 1, position: 'relative' }}
            >
              <Typography
                variant="body2"
                sx={{ fontFamily: 'monospace', textAlign: 'center' }}
              >
                join government-think
              </Typography>

              <IconButton
                onClick={() => navigator.clipboard.writeText('join government-think')}
                size="small"
                aria-label="Copy"
                sx={{ position: 'absolute', right: 8 }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>

            <Button
              variant="contained"
              color="success"
              size="small"
              href="https://wa.me/14155238886?text=join%20government-think"
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
            >
              Open WhatsApp Chat
            </Button>
          </Box>
        )}

        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={sendOtp}
            disabled={loading || cooldown > 0}
            fullWidth
            component={motion.button}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <AnimatePresence mode="wait">
                {cooldown > 0 ? (
                  <motion.span
                    key="countdown"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    Resend in {cooldown}s
                  </motion.span>
                ) : (
                  <motion.span
                    key="send"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    Send OTP
                  </motion.span>
                )}
              </AnimatePresence>
            )}
          </Button>
        </Box>

        <TextField
          fullWidth
          label="Enter OTP Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          margin="normal"
        />

        <Button
          variant="contained"
          color="success"
          onClick={verifyOtp}
          disabled={loading || code.length === 0}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Verify'}
        </Button>
      </Paper>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackOpen(false)}
          severity={snackSeverity}
          sx={{ width: '100%' }}
        >
          {snackMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default VerifyPhonePage;
