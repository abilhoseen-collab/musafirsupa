import React, { useEffect, useState } from 'react';
import { FiPlus, FiEye, FiEdit2 } from 'react-icons/fi';
import api from '../services/api';

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('বুকিং লোড ব্যর্থ:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'confirmed': 'নিশ্চিত',
      'pending': 'অপেক্ষমাণ',
      'cancelled': 'বাতিল',
      'completed': 'সম্পন্ন'
    };
    return labels[status] || status;
  };

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">📋 বুকিং ম্যানেজমেন্ট</h1>
          <p className="text-gray-600 mt-1">সমস্ত বুকিং ট্র্যাক করুন এবং পরিচালনা করুন</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition">
          <FiPlus /> নতুন বুকিং
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'সকল' : getStatusLabel(status)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">লোড হচ্ছে...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">কোনো বুকিং পাওয়া যায়নি</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">গ্রাহক</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">এয়ারলাইন্স</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">যাত্রা তারিখ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">অবস্থা</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-800 font-medium">{booking.customer_name}</td>
                    <td className="px-6 py-4 text-gray-700">{booking.airline_name}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(booking.departure_date).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 transition">
                        <FiEye />
                      </button>
                      <button className="text-green-600 hover:text-green-800 transition">
                        <FiEdit2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingsPage;