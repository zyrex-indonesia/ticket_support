import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/login', {
        username,
        password,
      });
      const token = response.data.token;

      if (token === 'admin-token') {
        localStorage.setItem('token', token); // Store token
        navigate('/admin/panel'); // Navigate to admin panel
      } else {
        alert('Unauthorized');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid login credentials');
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
