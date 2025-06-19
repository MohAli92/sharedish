// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';

const layoutStyle = {
  minHeight: '100vh',
  backgroundImage: `url("/assets/background.png")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  flexDirection: 'column',
};

const contentStyle = {
  flex: 1,
  padding: '20px',
};

const Layout = ({ children }) => {
  return (
    <div style={layoutStyle}>
      <Navbar />
      <div style={contentStyle}>{children}</div>
    </div>
  );
};

export default Layout;
