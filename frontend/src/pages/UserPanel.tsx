import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserPanel: React.FC = () => {
  const [tickets, setTickets] = useState([]);
  const [username, setUsername] = useState(''); // Allow user input for name
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Tinggi');
  const [category, setCategory] = useState('Jaringan');
  const [attachment, setAttachment] = useState<File | null>(null);

  // Fetch user tickets from the backend
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:8080/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };
    fetchTickets();
  }, []);

  // Handle ticket submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('description', description);
    formData.append('priority', priority);
    formData.append('category', category);
    if (attachment) formData.append('attachment', attachment);

    try {
      await axios.post('http://localhost:8080/tickets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Ticket submitted successfully!');
      setUsername(''); // Clear username field
      setDescription(''); // Clear description field
      setPriority('Tinggi'); // Reset priority to default
      setCategory('Jaringan'); // Reset category to default
      setAttachment(null); // Clear attachment
    } catch (error) {
      console.error('Error submitting ticket:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100%', // Matches the height of the root element
        width: '100%',
        overflow: 'hidden', // Prevents scrollbars
      }}
    >
      {/* Left Side: Ticket List */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#e0e0e0',
          padding: '20px',
          overflowY: 'auto', // If ticket list grows, allow scrolling only inside this section
        }}
      >
        <img
          src="/logo.png"
          alt="Zyrex Logo"
          style={{ width: '150px', height: 'auto', marginBottom: '20px' }}
        />
        <h2>Status</h2>
        <div style={{ marginTop: '20px' }}>
          {tickets.map((ticket: any, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#fff',
                margin: '10px 0',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              <p><strong>Kategori:</strong> {ticket.category}</p>
              <p><strong>Prioritas:</strong> {ticket.priority}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
            </div>
          ))}
        </div>
      </div>
  
      {/* Right Side: Ticket Form */}
      <div
        style={{
          flex: 2,
          backgroundColor: '#d32f2f',
          padding: '40px',
          color: '#fff',
          overflowY: 'auto', // Allows form scrolling if it overflows
        }}
      >
        <h2>Form Help Desk</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}
        >
          {/* Nama */}
          <label>
            Nama:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                boxSizing: 'border-box',
              }}
              placeholder="Masukkan Nama"
            />
          </label>
  
          {/* Prioritas */}
          <label>
            Prioritas:
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            >
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </label>
  
          {/* Kategori */}
          <label>
            Kategori:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            >
              <option value="Jaringan">Jaringan</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
            </select>
          </label>
  
          {/* Lampiran */}
          <label>
            Lampiran:
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </label>
  
          {/* Deskripsi */}
          <label>
            Deskripsi:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                boxSizing: 'border-box',
                minHeight: '100px',
              }}
              placeholder="Masukkan deskripsi masalah"
            />
          </label>
  
          <button
            type="submit"
            style={{
              padding: '10px',
              backgroundColor: 'green',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default UserPanel;
