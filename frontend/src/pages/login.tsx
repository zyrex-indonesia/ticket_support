import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; // Make sure your styles are in this file or adjust accordingly

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
    <div className="flex justify-center items-center h-screen bg-red-800">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
      <img
        src="/logo.png" // Replace with the path to your logo file
        alt="Zyrex Logo"
        className="w-24 mx-auto mb-8"
      />
        <div className="mb-4">
          <label className="block text-left text-gray-700 text-sm font-bold mb-2">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-500"
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-6">
          <label className="block text-left text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-500"
            placeholder="Enter your password"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
