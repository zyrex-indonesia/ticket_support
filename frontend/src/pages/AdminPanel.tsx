import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface NullString {
  String: string;
  Valid: boolean;
}
// Define the type for a ticket
interface Ticket {
  id: number;
  name: string;
  description: string;
  priority: string;
  category: string;
  status: string;
  created_at: string;
  progress_start_time?: NullString;
  completed_time?: NullString;
  person_in_charge?: string;
  time: string;
  attachment?: string; // Add this property for attachment
}

const AdminPanel: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    date: '',
    name: '',
    category: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin');
        return;
      }
      try {
        const response = await axios.get('http://localhost:8080/tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data);
        setFilteredTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        alert('Session expired, please log in again');
        localStorage.removeItem('token');
        navigate('/admin');
      }
    };
    fetchTickets();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const handleFiltersChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    let filtered = tickets;

    if (filters.priority) {
      filtered = filtered.filter((ticket) => ticket.priority === filters.priority);
    }

    if (filters.status) {
      filtered = filtered.filter((ticket) => ticket.status === filters.status);
    }

    if (filters.date) {
      filtered = filtered.filter((ticket) => ticket.created_at.includes(filters.date));
    }

    if (filters.name) {
      filtered = filtered.filter((ticket) =>
        ticket.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter((ticket) => ticket.category === filters.category);
    }

    setFilteredTickets(filtered);
  }, [filters, tickets]);

  const handleStatusChange = (ticketId: number, newStatus: string) => {
    const updated = filteredTickets.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    );
    setFilteredTickets(updated);
  };

  const handlePersonChange = (ticketId: number, newPerson: string) => {
    const updated = filteredTickets.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, person_in_charge: newPerson } : ticket
    );
    setFilteredTickets(updated);
  };

  const handleSubmit = async (ticketId: number) => {
    try {
      const ticket = filteredTickets.find((t) => t.id === ticketId);
      if (!ticket) throw new Error('Ticket not found');

      const response = await axios.put(`http://localhost:8080/tickets/${ticketId}`, {
        status: ticket.status,
        person_in_charge: ticket.person_in_charge,
      });
      alert(response.data.message || 'Ticket updated successfully!');
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Failed to update ticket');
    }
  };

  return (
    <div className="bg-red-900 h-screen flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white px-6 py-4 shadow-md fixed top-0 left-0 w-full z-10">
        <img src="/logo.png" alt="Zyrex Logo" className="h-8" />
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-900 text-white font-bold rounded-lg hover:bg-red-800"
        >
          Log Out
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="pt-20 flex-1 overflow-y-auto pb-6">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-6 max-w-3xl mx-auto">
          <h2 className="text-lg font-bold mb-4">Filters</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Priority:
                <select
                  className="block w-full mt-1 p-2 border rounded-lg"
                  value={filters.priority}
                  onChange={(e) => handleFiltersChange('priority', e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Tinggi">Tinggi</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Rendah">Rendah</option>
                </select>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Status:
                <select
                  className="block w-full mt-1 p-2 border rounded-lg"
                  value={filters.status}
                  onChange={(e) => handleFiltersChange('status', e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Baru">Baru</option>
                  <option value="Dalam Proses">Dalam Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Date:
                <input
                  type="date"
                  className="block w-full mt-1 p-2 border rounded-lg"
                  value={filters.date}
                  onChange={(e) => handleFiltersChange('date', e.target.value)}
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Name:
                <input
                  type="text"
                  className="block w-full mt-1 p-2 border rounded-lg"
                  placeholder="Enter name"
                  value={filters.name}
                  onChange={(e) => handleFiltersChange('name', e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Tickets Section */}
        <div className="grid grid-cols-1 gap-6 p-4">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-lg font-semibold">Nama: {ticket.name}</p>
                  <p>Kategori: {ticket.category}</p>
                  <p>Prioritas: {ticket.priority}</p>
                  <p>Status: {ticket.status}</p>
                  <p>Deskripsi: {ticket.description}</p>
                </div>
                  <div>
                    <p>Submitted Time: {ticket.created_at.replace('T', ' ').replace('Z', '')}</p>
                    <p>
                      Progress Start Time:{' '}
                      {ticket.progress_start_time?.Valid
                        ? ticket.progress_start_time.String.replace('T', ' ').replace('Z', '')
                        : 'N/A'}
                    </p>
                    <p>
                      Completed Time:{' '}
                      {ticket.completed_time?.Valid
                        ? ticket.completed_time.String.replace('T', ' ').replace('Z', '')
                        : 'N/A'}
                    </p>
                  </div>
              </div>
              {ticket.attachment && (
                <p className="mt-4">
                  Attachment:{' '}
                  <a
                    href={`http://localhost:8080/uploads/${ticket.attachment.replace('/uploads/','').replace('.', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Lampiran
                  </a>
                </p>
              )}
              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Update Status:
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                    className="block mt-1 p-2 border rounded-lg w-full"
                  >
                    <option value="Baru">Baru</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </label>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Assign Person in Charge:
                  <input
                    type="text"
                    value={ticket.person_in_charge || ''}
                    onChange={(e) => handlePersonChange(ticket.id, e.target.value)}
                    placeholder="Enter person in charge"
                    className="block mt-1 p-2 border rounded-lg w-full"
                  />
                </label>
              </div>
              <button
                onClick={() => handleSubmit(ticket.id)}
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Submit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
