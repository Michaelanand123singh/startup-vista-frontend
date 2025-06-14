import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (token) {
          const response = await api.get('/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
        } else if (refreshToken) {
          await refreshAuthToken(refreshToken);
        }
      } catch (err) {
        clearAuthData();
        setError(err.response?.data?.message || 'Session verification failed');
      } finally {
        setLoading(false);
      }
    };

    verifySession();

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await api.post('/auth/firebase', { idToken: token });
          setAuthData(response.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Firebase auth failed');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const setAuthData = (data) => {
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    setUser(data.user);
    setError(null);
  };

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const refreshAuthToken = useCallback(async (refreshToken) => {
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      setAuthData(response.data);
      return response.data.token;
    } catch (err) {
      clearAuthData();
      throw err;
    }
  }, []);

  // Add API response interceptor for token refresh
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const newToken = await refreshAuthToken(refreshToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [refreshAuthToken]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      setAuthData(response.data);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      setAuthData(response.data);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const response = await api.post('/auth/firebase', { idToken: token });
      setAuthData(response.data);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // New function to update user role
  const updateUserRole = async (role) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.patch('/auth/update-role', 
        { role }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update user state with new role
      setUser(prev => ({
        ...prev,
        role: role
      }));
      
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Try Firebase logout if Firebase user
      if (user?.provider === 'firebase') {
        await firebaseSignOut(auth);
      }
      // Backend logout
      await api.post('/auth/logout');
      clearAuthData();
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    signInWithGoogle,
    updateUserRole, // Add this new function
    refreshAuthToken,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};