import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const username = 'current_user'; // Replace with actual username
        const response = await axios.get(`http://localhost:8080/user/tickets?username=${username}`);
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div>
      <h1>Status Ticket</h1>
      <ul>
        {tickets.map((ticket: any, idx) => (
          <li key={idx}>
            <strong>{ticket.description}</strong> - {ticket.priority} - {ticket.status} - SLA: {ticket.sla_deadline}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
