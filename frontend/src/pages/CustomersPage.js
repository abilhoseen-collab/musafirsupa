import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiPhone, FiMail } from 'react-icons/fi';
import api from '../services/api';

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('গ্রাহক লোড ব্যর্থ:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">👥 গ্রাহক ম্যানেজমেন্ট</h1>
          <p className="text-gray-600 mt-1">সমস্ত গ্রাহক তথ্য পরিচালনা করুন</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <FiPlus /> নতুন গ্রাহক
        </button>
      </div>

      {/* Customers Grid */}
      {loading ? (
        <div className="text-center text-gray-500 py-8">লোড হচ্ছে...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{customer.name}</h3>
              <div className="space-y-2 text-gray-600 text-sm mb-4">
                <p className="flex items-center gap-2">
                  <FiPhone size={16} className="text-blue-600" /> {customer.phone}
                </p>
                {customer.email && (
                  <p className="flex items-center gap-2">
                    <FiMail size={16} className="text-blue-600" /> {customer.email}
                  </p>
                )}
                {customer.city && <p>📍 {customer.city}</p>}
              </div>
              <button className="w-full bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition">
                <FiEdit2 size={16} /> সম্পাদনা করুন
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomersPage;