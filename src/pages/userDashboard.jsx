import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDashboard() {
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: '',
    location: '',
    issue: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserName(res.data.name));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const complaintText = `
👤 Name: ${formData.fullName}
📞 Phone: ${formData.phone}
📧 Email: ${formData.email}
📍 Location: ${formData.location}
📝 Subject: ${formData.subject}
⚠️ Issue: ${formData.issue}
`;

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/complaints`,
        { text: complaintText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("🎉 Complaint submitted! You've earned 10 Clean Yamuna Points 🌱");
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        subject: '',
        location: '',
        issue: '',
      });
    } catch (err) {
      alert('Failed to submit complaint.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-8">
      <div className="max-w-3xl mx-auto bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-blue-300">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Welcome, {userName}
        </h2>

        <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">
          📣 Submit a Pollution Complaint
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-blue-800 font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-blue-800 font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g., 9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-blue-800 font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-blue-800 font-medium mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="e.g., Oil Leakage from Factory"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-blue-800 font-medium mb-1">Location near Yamuna</label>
            <input
              type="text"
              name="location"
              placeholder="e.g., Near ITO Bridge, Delhi"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Issue */}
          <div>
            <label className="block text-blue-800 font-medium mb-1">Main Flaw / Issue</label>
            <textarea
              name="issue"
              rows="5"
              placeholder="Describe the pollution issue in detail..."
              value={formData.issue}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            🚀 Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserDashboard;
