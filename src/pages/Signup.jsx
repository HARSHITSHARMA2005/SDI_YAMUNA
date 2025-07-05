import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'public',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, formData);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
      console.error('Signup error:', err);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f1c2c, #928DAB)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div
        style={{
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '40px',
          width: '400px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>Create an Account</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ ...inputStyle, color: '#fff' }}
          >
            <option value="public">Public</option>
            <option value="government">Government</option>
          </select>
          <button
            type="submit"
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              transition: '0.3s',
              boxShadow: '0 0 10px rgba(102,126,234,0.8)',
            }}
            onMouseOver={(e) => (e.target.style.boxShadow = '0 0 20px rgba(102,126,234,1)')}
            onMouseOut={(e) => (e.target.style.boxShadow = '0 0 10px rgba(102,126,234,0.8)')}
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '12px',
  borderRadius: '10px',
  border: 'none',
  outline: 'none',
  background: 'rgba(255, 255, 255, 0.15)',
  color: '#fff',
  fontSize: '15px',
  boxShadow: 'inset 0 0 8px rgba(255, 255, 255, 0.1)',
};

export default Signup;
