import React, { useEffect, useState } from 'react';
import { FiPlus, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';

function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('পেমেন্ট লোড ব্যর্থ:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPayments = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">💰 পেমেন্ট ম্যানেজমেন্ট</h1>
          <p className="text-gray-600 mt-1">সমস্ত অর্থপ্রদান ট্র্যাক করুন</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition">
          <FiPlus /> পেমেন্ট রেকর্ড
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">মোট অর্থপ্রদান</p>
            <p className="text-4xl font-bold mt-2">৳{totalPayments.toFixed(2)}</p>
          </div>
          <FiCheckCircle size={48} className="opacity-20" />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">লোড হচ্ছে...</div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">কোনো পেমেন্ট রেকর্ড নেই</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">গ্রাহক</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">পরিমাণ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">পদ্ধতি</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">রেফারেন্স</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-800 font-medium">{payment.customer_name}</td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">৳{payment.amount}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {payment.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">{payment.reference_number}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(payment.created_at).toLocaleDateString('bn-BD')}
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

export default PaymentsPage;