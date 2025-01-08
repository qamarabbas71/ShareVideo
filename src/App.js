import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';
import { UserProvider } from './context/userContext.js'; // Import UserProvider
import UserPage from './pages/userpage/userPage.js';
import Search from './pages/search/Search.js';

const App = () => {
  return (
    <UserProvider> {/* Wrap the app in UserProvider */}
      <Router>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
