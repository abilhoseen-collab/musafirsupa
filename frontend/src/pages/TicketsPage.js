import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import api from '../services/api';

function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    airline_id: '',
    destination_country_id: '',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('টিকেট লোড ব্যর্থ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tickets', formData);
      setShowModal(false);
      setFormData({ airline_id: '', destination_country_id: '', price: '', quantity: '' });
      fetchTickets();
    } catch (error) {
      console.error('টিকেট তৈরি ব্যর্থ:', error);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.airline_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.country_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">🎫 টিকেট ম্যানেজমেন্ট</h1>
          <p className="text-gray-600 mt-1">সমস্ত ফ্লাইট টিকেট পরিচালনা করুন</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <FiPlus /> নতুন টিকেট
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-2">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="এয়ারলাইন্স বা দেশ দ্বারা অনুসন্ধান করুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">লোড হচ্ছে...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">কোনো টিকেট পাওয়া যায়নি</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">এয়ারলাইন্স</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">গন্তব্য</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">মূল্য</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">স্টক</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-800 font-medium">{ticket.airline_name}</td>
                  <td className="px-6 py-4 text-gray-700">{ticket.country_name}</td>
                  <td className="px-6 py-4 text-gray-700 font-semibold">৳{ticket.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      ticket.quantity > 10 ? 'bg-green-100 text-green-800' :
                      ticket.quantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {ticket.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 transition">
                      <FiEdit2 />
                    </button>
                    <button className="text-red-600 hover:text-red-800 transition">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">নতুন টিকেট যোগ করুন</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">এয়ারলাইন্স ID</label>
                <input
                  type="text"
                  value={formData.airline_id}
                  onChange={(e) => setFormData({ ...formData, airline_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">দেশ ID</label>
                <input
                  type="text"
                  value={formData.destination_country_id}
                  onChange={(e) => setFormData({ ...formData, destination_country_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">মূল্য</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">পরিমাণ</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketsPage;