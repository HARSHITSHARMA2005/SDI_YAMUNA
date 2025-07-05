import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, formData);
      const { token, role } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      alert('Login successful! Redirecting...');

      navigate(role === 'government' ? '/gov-dashboard' : '/user-dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
      console.error(err);
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
        <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>Login to Your Dashboard</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
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
            Login
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

export default Login;


