import React, { createContext, useState, useEffect } from 'react';
import axios from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (token) {
          const res = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });

          // ✅ حفظ userId في localStorage (احتياطياً)
          localStorage.setItem('userId', res.data._id);

          // ✅ تضمين التوكن جوا بيانات اليوزر
          setUser({ ...res.data, token });
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (payload) => {
    try {
      const res = await axios.post('/api/auth/login', payload);

      // ✅ حفظ التوكن و userId في localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user._id);

      // ✅ حفظ التوكن داخل بيانات المستخدم
      setUser({ ...res.data.user, token: res.data.token });

      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
