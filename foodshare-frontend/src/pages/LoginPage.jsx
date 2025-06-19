import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', phone: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      password: formData.password,
    };

    await login(payload);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: 30,
          borderRadius: 10,
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <h2 style={{ marginBottom: 20, textAlign: 'center' }}>Login</h2>

        <input
          type="text"
          name="email"
          placeholder="Email (optional)"
          onChange={handleChange}
          value={formData.email}
          style={{ display: 'block', width: '100%', marginBottom: 10, padding: 10 }}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone (optional)"
          onChange={handleChange}
          value={formData.phone}
          style={{ display: 'block', width: '100%', marginBottom: 10, padding: 10 }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
          style={{ display: 'block', width: '100%', marginBottom: 20, padding: 10 }}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: 10,
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          Login
        </button>

        <div style={{ marginTop: 15, textAlign: 'center' }}>
          Don’t have an account?{' '}
          <Link to="/register" style={{ color: '#1976d2' }}>
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
