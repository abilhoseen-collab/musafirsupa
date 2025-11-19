import React, { useEffect, useState } from 'react';
import { FiBarChart3, FiDownload } from 'react-icons/fi';
import api from '../services/api';

function ReportsPage() {
  const [salesReport, setSalesReport] = useState([]);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [sales, financial] = await Promise.all([
        api.get('/reports/sales'),
        api.get('/reports/financial')
      ]);
      setSalesReport(sales.data);
      setFinancialData(financial.data);
    } catch (error) {
      console.error('রিপোর্ট লোড ব্যর্থ:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">📈 রিপোর্ট এবং বিশ্লেষণ</h1>
          <p className="text-gray-600 mt-1">ব্যবসায়িক পারফরম্যান্স ট্র্যাক করুন</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition">
          <FiDownload /> এক্সপোর্ট
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">লোড হচ্ছে...</div>
      ) : (
        <>
          {/* Financial Summary */}
          {financialData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-sm">মোট বিক্রয়</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ৳{financialData.total_sales.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-sm">মোট অর্থপ্রদান</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  ৳{financialData.total_payments.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-sm">মোট খরচ</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  ৳{financialData.total_expenses.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-sm">নেট ব্যালেন্স</p>
                <p className={`text-3xl font-bold mt-2 ${financialData.net_balance >= 0 ? 'text-purple-600' : 'text-orange-600'}`}>
                  ৳{financialData.net_balance.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Sales Report */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiBarChart3 /> দৈনিক বিক্রয় রিপোর্ট
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">তারিখ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">মোট বিক্রয়</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">রাজস্ব</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">গড় বিক্রয়</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {salesReport.map((report, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {new Date(report.sale_date).toLocaleDateString('bn-BD')}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{report.total_sales}</td>
                      <td className="px-6 py-4 text-gray-700 font-semibold">
                        ৳{parseFloat(report.total_revenue).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        ৳{parseFloat(report.average_sale).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReportsPage;