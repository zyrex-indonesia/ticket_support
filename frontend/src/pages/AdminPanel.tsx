import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const [tickets, setTickets] = useState([]);
  const [updatedStatus, setUpdatedStatus] = useState<{ [key: number]: string }>({});
  const [personInCharge, setPersonInCharge] = useState<{ [key: number]: string }>({});  
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

  const handleStatusChange = (ticketId: number, newStatus: string) => {
    setUpdatedStatus({ ...updatedStatus, [ticketId]: newStatus });
  };

  const handlePersonInChargeChange = (ticketId: number, person: string) => {
    setPersonInCharge({ ...personInCharge, [ticketId]: person });
  };

  const updateTicket = async (ticketId: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:8080/tickets/${ticketId}`,
        {
          status: updatedStatus[ticketId],
          person_in_charge: personInCharge[ticketId],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Ticket updated successfully');
      // Refresh tickets
      const response = await axios.get('http://localhost:8080/tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(response.data);
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Failed to update ticket');
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <ul>
        {tickets.map((ticket: any) => (
          <li key={ticket.id}>
            <div>
              <p>
                <strong>{ticket.name}:</strong> {ticket.description} (submitted
                on {ticket.date} at {ticket.time})
              </p>
              <p>
                <strong>Status:</strong> {ticket.status}
              </p>
              <p>
                <strong>Person in Charge:</strong>{' '}
                {ticket.person_in_charge || 'Not Assigned'}
              </p>
              <div>
                <label>
                  <strong>Update Status:</strong>
                  <select
                    value={updatedStatus[ticket.id] || ticket.status}
                    onChange={(e) =>
                      handleStatusChange(ticket.id, e.target.value)
                    }
                  >
                    <option value="Baru">Baru</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  <strong>Assign Person in Charge:</strong>
                  <input
                    type="text"
                    placeholder="Enter person in charge"
                    value={personInCharge[ticket.id] || ''}
                    onChange={(e) =>
                      handlePersonInChargeChange(ticket.id, e.target.value)
                    }
                  />
                </label>
              </div>
              <button
                onClick={() => updateTicket(ticket.id)}
                style={{
                  marginTop: '10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '5px 10px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Update Ticket
              </button>
            </div>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
