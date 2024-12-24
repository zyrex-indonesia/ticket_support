import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; 

const UserPanel: React.FC = () => {
  const [tickets, setTickets] = useState([]);
  const [username, setUsername] = useState('');
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
      setUsername('');
      setDescription('');
      setPriority('Tinggi');
      setCategory('Jaringan');
      setAttachment(null);
    } catch (error) {
      console.error('Error submitting ticket:', error);
    }
  };

  return (
    <div className="flex h-screen font-poppins">
      {/* Left Side: Ticket List */}
      <div className="flex-1 bg-gray-200 p-5 overflow-y-auto">
        <img
          src="/logo.png"
          alt="Zyrex Logo"
          className="w-40 mb-6"
        />
        <h2 className="text-xl font-semibold mb-4">Status</h2>
        <div>
          {tickets.map((ticket: any, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow mb-4"
            >
              <p><strong>Kategori:</strong> {ticket.category}</p>
              <p><strong>Prioritas:</strong> {ticket.priority}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Ticket Form */}
      <div className="flex-2 bg-red-700 p-10 text-white overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Form Help Desk</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* Nama */}
          <label>
            <span className="block text-sm font-medium">Nama:</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg text-black"
              placeholder="Masukkan Nama"
            />
          </label>

          {/* Prioritas */}
          <label>
            <span className="block text-sm font-medium">Prioritas:</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-3 rounded-lg text-black"
            >
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </label>

          {/* Kategori */}
          <label>
            <span className="block text-sm font-medium">Kategori:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-lg text-black"
            >
              <option value="Jaringan">Jaringan</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
            </select>
          </label>

          {/* Lampiran */}
          <label>
            <span className="block text-sm font-medium">Lampiran:</span>
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
              className="w-full p-3 rounded-lg text-black"
            />
          </label>

          {/* Deskripsi */}
          <label>
            <span className="block text-sm font-medium">Deskripsi:</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg text-black h-32"
              placeholder="Masukkan deskripsi masalah"
            />
          </label>

          <button
            type="submit"
            className="p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserPanel;
