import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome, FiBook, FiCalendar, FiDollarSign, FiUsers,
  FiBarChart2, FiLogOut, FiMenu, FiX, FiMosque
} from 'react-icons/fi';
import { useAuthStore } from '../context/authStore';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const menuItems = [
    { path: '/dashboard', label: 'ড্যাশবোর্ড', icon: FiHome },
    { path: '/tickets', label: 'টিকেট', icon: FiBook },
    { path: '/bookings', label: 'বুকিং', icon: FiCalendar },
    { path: '/umrah', label: 'ওমরাহ', icon: FiMosque },
    { path: '/payments', label: 'পেমেন্ট', icon: FiDollarSign },
    { path: '/customers', label: 'কাস্টমার', icon: FiUsers },
    { path: '/reports', label: 'রিপোর্ট', icon: FiBarChart2 }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition duration-200 z-40 w-64 bg-gray-900 text-white p-6 flex flex-col`}
      >
        {/* Logo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">✈️</span> এয়ার ট্রাভেল
          </h2>
          <p className="text-gray-400 text-sm mt-1">ম্যানেজমেন্ট সিস্টেম</p>
        </div>

        {/* User Info */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-400">স্বাগতম</p>
          <p className="font-semibold text-white">{user?.name}</p>
          <span className="inline-block mt-2 px-2 py-1 bg-blue-600 text-xs rounded text-white">
            {user?.role === 'admin' ? 'প্রশাসক' : user?.role === 'manager' ? 'পরিচালক' : 'কর্মী'}
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <FiLogOut /> লগআউট করুন
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;