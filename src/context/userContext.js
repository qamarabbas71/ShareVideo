import React, { createContext, useState } from 'react';
import API_ENDPOINTS from '../config';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Function to log in a user
  const login = async (email, password) => {
    try {
      // const response = await axios.post('http://localhost:5000/api/users/login', {
      const response = await axios.post(API_ENDPOINTS.login, {
        email,
        password,
      });

      const userData = response.data;
      setUser(userData); // Update state
      localStorage.setItem('user', JSON.stringify(userData)); // Save to localStorage
      localStorage.setItem('token', JSON.stringify(userData.token)); // Save to localStorage
      // console.log(userData.token)
      return userData; // Return user data for additional handling in the component
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw error; // Throw error to be handled by the component
    }
  };

  // Function to log out the user
  const logout = () => {
    setUser(null); // Clear state
    localStorage.removeItem('user');
    localStorage.clear();
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
