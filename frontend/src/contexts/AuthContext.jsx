import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      const storagedUser = localStorage.getItem('@TaskApp:user');
      const storagedToken = localStorage.getItem('@TaskApp:token');

      if (storagedUser && storagedToken) {
        // Optionally verify token with a /me request here
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.data);
        } catch (error) {
          localStorage.clear();
        }
      }
      setLoading(false);
    }

    loadStoragedData();
  }, []);

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data.data;

    localStorage.setItem('@TaskApp:user', JSON.stringify(user));
    localStorage.setItem('@TaskApp:token', token);

    setUser(user);
  }

  async function register(name, email, password, confirmPassword) {
    const response = await api.post('/auth/register', { name, email, password, confirmPassword });
    return response.data;
  }

  async function forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async function resetPassword(token, password) {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  }

  async function verifyEmail(token) {
    const response = await api.get(`/auth/verify?token=${token}`);
    return response.data;
  }

  function logout() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, register, forgotPassword, resetPassword, verifyEmail, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
