import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const userId = user?._id || localStorage.getItem('userId');

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
          component={Link}
          to="/"
          style={{ textDecoration: 'none', color: 'white' }}
        >
          ShareDish
        </Typography>
        {userId ? (
          <>
            <Button color="inherit" component={Link} to="/timeline">
              Timeline
            </Button>
            <Button color="inherit" component={Link} to={`/profile/${userId}`}>
              My Profile
            </Button>
            <Button color="inherit" component={Link} to="/upload-meal">
              Upload
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
