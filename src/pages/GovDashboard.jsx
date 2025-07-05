import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GovDashboard() {
  const [data, setData] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [userName, setUserName] = useState('');

  const fetchComplaints = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/complaints`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComplaints(res.data);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/pollution`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error('Pollution error', err));

    fetchComplaints();

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserName(res.data.name));
  }, []);

  const markResolved = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/complaints/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComplaints(); // Refresh the list
    } catch (err) {
      console.error('Failed to mark as resolved', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <div className="max-w-screen-xl mx-auto space-y-10">

        {/* Header */}
        <div className="bg-white bg-opacity-70 backdrop-blur-md shadow-xl p-6 rounded-2xl text-center border border-blue-200">
          <h2 className="text-4xl font-bold text-blue-800 mb-2">
            Welcome, {userName} <span className="text-sm text-gray-600">(Gov. Official)</span>
          </h2>
          <p className="text-lg text-gray-700">Monitor real-time pollution levels & citizen complaints.</p>
        </div>

        {/* Map */}
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-blue-300">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">📍 Yamuna Pollution Map</h3>
          <iframe
            src={`${import.meta.env.VITE_BACKEND_URL}/api/map`}
            width="100%"
            height="400"
            title="Pollution Map"
            className="rounded-xl border shadow-lg"
          ></iframe>
        </div>

        {/* Pollution Data */}
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-blue-300 overflow-auto">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">🧪 Pollution Metrics</h3>
          <table className="w-full table-auto text-left border-collapse">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">pH</th>
                <th className="px-4 py-2">Turbidity</th>
                <th className="px-4 py-2">Ammonia</th>
                <th className="px-4 py-2">Phosphate</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, idx) => (
                <tr key={idx} className="hover:bg-blue-50 transition-all">
                  <td className="px-4 py-2">{d.location}</td>
                  <td className="px-4 py-2">{d.ph}</td>
                  <td className="px-4 py-2">{d.turbidity}</td>
                  <td className="px-4 py-2">{d.ammonia}</td>
                  <td className="px-4 py-2">{d.phosphate}</td>
                  <td className="px-4 py-2 font-bold">
                    <span
                      className={`px-2 py-1 rounded ${
                        d.color === 'Red'
                          ? 'bg-red-500 text-white'
                          : d.color === 'Yellow'
                          ? 'bg-yellow-400 text-black'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {d.color}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Complaints */}
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-blue-300">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">📢 Citizen Complaints</h3>
          {complaints.length > 0 ? (
            <ul className="space-y-3">
              {complaints.map((c, idx) => (
                <li
                  key={idx}
                  className={`border-l-4 p-4 rounded-md shadow-sm ${
                    c.resolved ? 'bg-green-100 border-green-500' : 'bg-blue-50 border-blue-400'
                  }`}
                >
                  <p className="text-gray-800 whitespace-pre-line">{c.text}</p>
                  {!c.resolved && (
                    <button
                      onClick={() => markResolved(c._id)}
                      className="mt-2 inline-block bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                    >
                      ✅ Mark as Resolved
                    </button>
                  )}
                  {c.resolved && <span className="text-green-700 font-semibold">Resolved</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No complaints at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GovDashboard;
