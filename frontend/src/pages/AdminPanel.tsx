import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin'); // Redirect to login if no token
        return;
      }
      try {
        const response = await axios.get('http://localhost:8080/tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        alert('Session expired, please log in again');
        localStorage.removeItem('token');
        navigate('/admin'); // Redirect to login
      }
    };
    fetchTickets();
  }, [navigate]);

  return (
    <div>
      <h1>Admin Panel</h1>
      <ul>
        {tickets.map((ticket: any, idx) => (
          <li key={idx}>
            {ticket.username}: {ticket.description} (submitted on {ticket.date} at {ticket.time})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
