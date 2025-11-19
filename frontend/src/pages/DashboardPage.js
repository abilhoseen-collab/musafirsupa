import React, { useEffect, useState } from 'react';
import { FiBarChart3, FiTrendingUp, FiUsers, FiDollarSign, FiCalendar, FiBook } from 'react-icons/fi';
import api from '../services/api';

function DashboardPage() {
  const [stats, setStats] = useState({
    total_sales: 0,
    total_payments: 0,
    total_expenses: 0,
    net_balance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports/financial');
      setStats(response.data);
    } catch (err) {
      setError('ড্যাশবোর্ড ডেটা লোড করতে ব্যর্থ');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount);
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{formatCurrency(value)}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-2xl text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 ড্যাশবোর্ড</h1>
        <p className="text-gray-600">আপনার ব্যবসায়ের সংক্ষিপ্ত বিবরণ</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">ডেটা লোড হচ্ছে...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={FiDollarSign}
              label="মোট বিক্রয়"
              value={stats.total_sales}
              color="bg-green-500"
            />
            <StatCard
              icon={FiTrendingUp}
              label="মোট অর্থপ্রদান"
              value={stats.total_payments}
              color="bg-blue-500"
            />
            <StatCard
              icon={FiBarChart3}
              label="মোট খরচ"
              value={stats.total_expenses}
              color="bg-red-500"
            />
            <StatCard
              icon={FiDollarSign}
              label="নেট ব্যালেন্স"
              value={stats.net_balance}
              color={`${stats.net_balance >= 0 ? 'bg-purple-500' : 'bg-orange-500'}`}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">দ্রুত অ্যাকশন</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                <FiBook className="text-2xl text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">নতুন টিকেট</p>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                <FiCalendar className="text-2xl text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">নতুন বুকিং</p>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                <FiUsers className="text-2xl text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">নতুন গ্রাহক</p>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                <FiDollarSign className="text-2xl text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">পেমেন্ট রেকর্ড</p>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;