import React, { useEffect, useState } from 'react';
import { FiPlus, FiEye, FiUsers, FiTruck, FiHome, FiDollarSign } from 'react-icons/fi';
import api from '../services/api';

function UmrahPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    group_name: '',
    departure_date: '',
    return_date: '',
    group_size: '',
    total_budget: '',
    coordinator_name: ''
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get('/umrah/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('ওমরাহ গ্রুপ লোড ব্যর্থ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/umrah/groups', formData);
      setShowModal(false);
      setFormData({
        group_name: '',
        departure_date: '',
        return_date: '',
        group_size: '',
        total_budget: '',
        coordinator_name: ''
      });
      fetchGroups();
    } catch (error) {
      console.error('গ্রুপ তৈরি ব্যর্থ:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('bn-BD');
  };

  const getStatusColor = (status) => {
    const colors = {
      'planning': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'ongoing': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-purple-100 text-purple-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'planning': 'পরিকল্পনা',
      'confirmed': 'নিশ্চিত',
      'ongoing': 'চলমান',
      'completed': 'সম্পন্ন',
      'cancelled': 'বাতিল'
    };
    return labels[status] || status;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">🕌 ওমরাহ ম্যানেজমেন্ট</h1>
          <p className="text-gray-600 mt-1">ওমরাহ গ্রুপ এবং যাত্রী পরিচালনা করুন</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <FiPlus /> নতুন গ্রুপ
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">মোট গ্রুপ</p>
              <p className="text-3xl font-bold text-gray-800">{groups.length}</p>
            </div>
            <FiUsers className="text-3xl text-blue-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">মোট যাত্রী</p>
              <p className="text-3xl font-bold text-gray-800">
                {groups.reduce((sum, g) => sum + (g.pilgrims_count || 0), 0)}
              </p>
            </div>
            <FiUsers className="text-3xl text-green-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">মোট খরচ</p>
              <p className="text-3xl font-bold text-gray-800">
                ৳{groups.reduce((sum, g) => sum + parseFloat(g.total_expenses || 0), 0).toLocaleString('bn-BD')}
              </p>
            </div>
            <FiDollarSign className="text-3xl text-red-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">সক্রিয় গ্রুপ</p>
              <p className="text-3xl font-bold text-gray-800">
                {groups.filter(g => g.status === 'confirmed' || g.status === 'ongoing').length}
              </p>
            </div>
            <FiHome className="text-3xl text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="text-center text-gray-500 py-8">লোড হচ্ছে...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800 flex-1">{group.group_name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(group.status)}`}>
                  {getStatusLabel(group.status)}
                </span>
              </div>

              <div className="space-y-2 text-gray-600 text-sm mb-4">
                <p className="flex items-center gap-2">
                  📅 প্রস্থান: {formatDate(group.departure_date)}
                </p>
                <p className="flex items-center gap-2">
                  📅 প্রত্যাবর্তন: {formatDate(group.return_date)}
                </p>
                <p className="flex items-center gap-2">
                  <FiUsers size={16} /> যাত্রী: {group.pilgrims_count || 0}/{group.group_size}
                </p>
                <p className="flex items-center gap-2">
                  <FiDollarSign size={16} /> খরচ: ৳{parseFloat(group.total_expenses).toLocaleString('bn-BD')}
                </p>
                {group.total_budget && (
                  <p className="flex items-center gap-2">
                    💰 বাজেট: ৳{parseFloat(group.total_budget).toLocaleString('bn-BD')}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedGroup(group)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <FiEye /> বিস্তারিত দেখুন
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedGroup.group_name}</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-500 text-sm">প্রস্থান</p>
                <p className="font-semibold text-gray-800">{formatDate(selectedGroup.departure_date)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">প্রত্যাবর্তন</p>
                <p className="font-semibold text-gray-800">{formatDate(selectedGroup.return_date)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">গ্রুপ আকার</p>
                <p className="font-semibold text-gray-800">{selectedGroup.group_size} জন</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">বাজেট</p>
                <p className="font-semibold text-gray-800">
                  ৳{selectedGroup.total_budget ? parseFloat(selectedGroup.total_budget).toLocaleString('bn-BD') : 'নির্ধারিত নয়'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 text-sm">সমন্বয়কারী</p>
                <p className="font-semibold text-gray-800">{selectedGroup.coordinator_name}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedGroup(null)}
              className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* Add Group Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">নতুন ওমরাহ গ্রুপ</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">গ্রুপ নাম</label>
                <input
                  type="text"
                  value={formData.group_name}
                  onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">প্রস্থান তারিখ</label>
                <input
                  type="date"
                  value={formData.departure_date}
                  onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">প্রত্যাবর্তন তারিখ</label>
                <input
                  type="date"
                  value={formData.return_date}
                  onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">গ্রুপ আকার</label>
                <input
                  type="number"
                  value={formData.group_size}
                  onChange={(e) => setFormData({ ...formData, group_size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">মোট বাজেট</label>
                <input
                  type="number"
                  value={formData.total_budget}
                  onChange={(e) => setFormData({ ...formData, total_budget: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">সমন্বয়কারীর নাম</label>
                <input
                  type="text"
                  value={formData.coordinator_name}
                  onChange={(e) => setFormData({ ...formData, coordinator_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition text-sm"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UmrahPage;