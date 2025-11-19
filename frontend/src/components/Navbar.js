import React from 'react';
import { FiBell, FiSettings, FiUser } from 'react-icons/fi';
import { useAuthStore } from '../context/authStore';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';

function Navbar() {
  const user = useAuthStore((state) => state.user);
  const currentTime = new Date();

  const getRoleLabel = (role) => {
    const roles = {
      admin: 'প্রশাসক',
      manager: 'পরিচালক',
      staff: 'কর্মী'
    };
    return roles[role] || role;
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-8 py-4 flex justify-between items-center">
        {/* Left Side */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">স্বাগতম, {user?.name}! 👋</h1>
          <p className="text-sm text-gray-600 mt-1">
            আজ {currentTime.toLocaleDateString('bn-BD')} - {currentTime.toLocaleTimeString('bn-BD')}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative text-gray-600 hover:text-gray-900 transition">
            <FiBell size={24} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="text-gray-600 hover:text-gray-900 transition">
            <FiSettings size={24} />
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div className="text-right">
              <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
              <p className="text-xs text-gray-600">{getRoleLabel(user?.role)}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;