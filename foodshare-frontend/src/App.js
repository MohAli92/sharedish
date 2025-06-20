import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MealUploadPage from './pages/MealUploadPage';
import MealDetailsPage from './pages/MealDetailsPage';
import UserProfilePage from './pages/UserProfilePage';
import MessagesPage from './pages/MessagesPage';
import VerifyPhonePage from './pages/VerifyPhonePage';
import TimelinePage from './pages/TimelinePage';
import EditUserPage from './pages/EditUserPage'; // ✅ جديد

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// 🎨 Theme setup
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Green
    },
    secondary: {
      main: '#FF9800', // Orange
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <SocketProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-phone" element={<VerifyPhonePage />} />
                <Route path="/meals/:id" element={<MealDetailsPage />} />
                <Route path="/profile/:userId" element={<UserProfilePage />} />
                <Route path="/timeline" element={<TimelinePage />} /> {/* ✅ صفحة التايملاين */}
                <Route path="/edit-profile" element={<EditUserPage />} /> {/* ✅ صفحة تعديل البروفايل */}

                <Route element={<ProtectedRoute />}>
                  <Route path="/upload-meal" element={<MealUploadPage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/messages/:conversationId" element={<MessagesPage />} />
                </Route>
              </Routes>
            </Layout>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
