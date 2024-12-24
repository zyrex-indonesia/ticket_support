import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPanel from './pages/UserPanel'; // The form for users
import AdminPanel from './pages/AdminPanel'; // Admin panel for admins
import Login from './pages/login'; // Login page for admins
import './App.css'; // Ensure this path is correct

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public access: User panel */}
        <Route path="/" element={<UserPanel />} />

        {/* Admin login and panel */}
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
