import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper function to update user from token
  const updateUserFromToken = (token) => {
    const decoded = decodeToken(token);
    if (decoded && decoded.user_name) {
      setUser({ 
        user_name: decoded.user_name,
        userId: decoded.userId 
      });
    }
  };

  // Set up axios interceptor to automatically add token to requests
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // Only add auth header to our backend API calls
        if (accessToken && 
            config.url && 
            (config.url.includes('localhost:5000') || config.url.startsWith('/')) &&
            !config.url.includes('/token')) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  // Set up axios interceptor to handle token refresh on 401/403
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Only handle token refresh for our backend API calls
        if (
          error.response?.status === 401 && 
          !originalRequest._retry && 
          !isRefreshing &&
          originalRequest.url &&
          (originalRequest.url.includes('localhost:5000') || originalRequest.url.startsWith('/')) &&
          !originalRequest.url.includes('/token')
        ) {
          originalRequest._retry = true;
          
          try {
            const newToken = await refreshAccessToken();
            // Retry the original request with new token
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return axios(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [isRefreshing]);

  // Function to refresh access token
  const refreshAccessToken = async () => {
    if (isRefreshing) {
      throw new Error('Already refreshing token');
    }

    setIsRefreshing(true);
    
    try {
      const response = await axios.get('http://localhost:5000/token', {
        withCredentials: true // This is important for sending cookies
      });
      
      const newAccessToken = response.data.accessToken;
      setAccessToken(newAccessToken);
      
      // Update user information from the new token
      updateUserFromToken(newAccessToken);
      
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear auth state on refresh failure
      setUser(null);
      setAccessToken(null);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  };

  // Function to login
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        user_name: username,
        password: password,
      }, {
        withCredentials: true // This is important for receiving cookies
      });

      const { accessToken } = response.data;
      setAccessToken(accessToken);
      
      // Extract user information from the token instead of using input username
      updateUserFromToken(accessToken);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.msg || 'Login failed' 
      };
    }
  };

  // Function to logout
  const logout = async () => {
    try {
      await axios.delete('http://localhost:5000/logout', {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  // Function to check authentication status on app load
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      await refreshAccessToken();
      // User information is now properly set in refreshAccessToken via updateUserFromToken
    } catch (error) {
      // Token refresh failed, user is not authenticated
      console.log('No valid session found');
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    accessToken,
    loading,
    login,
    logout,
    refreshAccessToken,
    isAuthenticated: !!user && !!accessToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 