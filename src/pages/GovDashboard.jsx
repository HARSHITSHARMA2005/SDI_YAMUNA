import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND = 'https://sdi-finals.onrender.com';

export default function GovDashboard() {
  const [data, setData] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchComplaints = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${BACKEND}/api/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      console.error('Complaints error', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    if (name) setUserName(name);

    axios.get(`${BACKEND}/api/pollution`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setData(res.data)).catch(err => console.error('Pollution error', err));

    fetchComplaints();
  }, []);

  const markResolved = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${BACKEND}/api/complaints/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComplaints();
    } catch (err) {
      console.error('Failed to resolve', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const resolved = complaints.filter(c => c.resolved).length;
  const pending = complaints.filter(c => !c.resolved).length;
  const critical = data.filter(d => d.color === 'Red').length;
  const safe = data.filter(d => d.color === 'Green').length;

  const filteredComplaints = complaints.filter(c => {
    const matchStatus = filterStatus === 'all' || (filterStatus === 'pending' ? !c.resolved : c.resolved);
    const matchSearch = c.text?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const parseComplaint = (text) => {
    if (!text) return {};
    const lines = text.split('\n').filter(l => l.trim());
    const result = {};
    lines.forEach(line => {
      if (line.includes('ISSUE TYPE:')) result.issueType = line.split(':')[1]?.trim();
      if (line.includes('SEVERITY:')) result.severity = line.split(':')[1]?.trim();
      if (line.includes('Name:')) result.name = line.split('Name:')[1]?.trim();
      if (line.includes('Phone:')) result.phone = line.split('Phone:')[1]?.trim();
      if (line.includes('Email:')) result.email = line.split('Email:')[1]?.trim();
      if (line.includes('Location:')) result.location = line.split('Location:')[1]?.trim();
      if (line.includes('Subject:')) result.subject = line.split('Subject:')[1]?.trim();
      if (line.includes('Issue:')) result.issue = line.split('Issue:')[1]?.trim();
    });
    return result;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .gd-root {
          min-height: 100vh;
          background: #f0f7ff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0f2744;
        }

        /* Header */
        .gd-header {
          background: linear-gradient(135deg, #0a3d7a 0%, #1565c0 50%, #0288d1 100%);
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
          box-shadow: 0 4px 24px rgba(10,61,122,0.3);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-left { display: flex; align-items: center; gap: 16px; }
        .gov-logo {
          width: 44px; height: 44px;
          background: rgba(255,255,255,0.15);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .gov-title {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
        }
        .gov-subtitle {
          font-size: 11px;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .header-right { display: flex; align-items: center; gap: 12px; }
        .official-chip {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          padding: 6px 14px;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
        }
        .official-avatar {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00d4ff, #0099ff);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff;
        }
        .logout-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 13px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }
        .logout-btn:hover { background: rgba(255,255,255,0.2); }

        /* Hero banner */
        .gd-hero {
          background: linear-gradient(135deg, #0a3d7a 0%, #1565c0 60%, #0288d1 100%);
          padding: 40px 40px 0;
          position: relative;
          overflow: hidden;
        }
        .gd-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }
        .hero-text { padding-bottom: 32px; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          padding: 5px 13px;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.8);
          font-weight: 600;
          margin-bottom: 14px;
        }
        .live-dot-w {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
          animation: wpulse 2s infinite;
        }
        @keyframes wpulse {
          0%,100% { box-shadow: 0 0 4px #4ade80; }
          50% { box-shadow: 0 0 14px #4ade80; }
        }
        .hero-title {
          font-size: clamp(26px, 3vw, 40px);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .hero-title span { color: #7dd3fc; }
        .hero-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.65);
          font-weight: 300;
          max-width: 460px;
        }
        .hero-img {
          width: 260px;
          opacity: 0.15;
          position: absolute;
          right: 40px;
          bottom: 0;
          pointer-events: none;
        }

        /* Wave */
        .hero-wave {
          display: block;
          width: 100%;
          margin-top: -2px;
        }

        /* Stats bar */
        .stats-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          background: #fff;
          border-bottom: 1px solid #e1eaf7;
          box-shadow: 0 2px 12px rgba(10,61,122,0.06);
        }
        .stat-item {
          padding: 20px 28px;
          border-right: 1px solid #e1eaf7;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: background 0.2s;
        }
        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: #f5faff; }
        .stat-icon-box {
          width: 44px; height: 44px;
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .stat-icon-box.blue   { background: #eff6ff; }
        .stat-icon-box.red    { background: #fef2f2; }
        .stat-icon-box.green  { background: #f0fdf4; }
        .stat-icon-box.amber  { background: #fffbeb; }
        .stat-num {
          font-size: 26px;
          font-weight: 800;
          color: #0f2744;
          line-height: 1;
          letter-spacing: -1px;
        }
        .stat-lbl { font-size: 12px; color: #64748b; margin-top: 3px; font-weight: 500; }

        /* Nav tabs */
        .gd-nav {
          background: #fff;
          border-bottom: 1px solid #e1eaf7;
          padding: 0 40px;
          display: flex;
          gap: 4px;
        }
        .nav-tab {
          padding: 16px 20px;
          border: none;
          background: none;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          color: #64748b;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .nav-tab:hover { color: #1565c0; }
        .nav-tab.active {
          color: #1565c0;
          border-bottom-color: #1565c0;
        }
        .nav-badge {
          background: #eff6ff;
          color: #1565c0;
          border-radius: 100px;
          padding: 1px 8px;
          font-size: 11px;
          font-weight: 700;
        }
        .nav-badge.red { background: #fef2f2; color: #dc2626; }

        /* Main content */
        .gd-main {
          max-width: 1300px;
          margin: 0 auto;
          padding: 32px 40px;
        }

        /* Section title */
        .sec-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f2744;
          margin-bottom: 4px;
          letter-spacing: -0.3px;
        }
        .sec-sub { font-size: 13px; color: #64748b; margin-bottom: 20px; font-weight: 400; }

        /* Map card */
        .map-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 20px rgba(10,61,122,0.08);
          border: 1px solid #e1eaf7;
          overflow: hidden;
          margin-bottom: 28px;
        }
        .map-header {
          padding: 18px 24px;
          border-bottom: 1px solid #e1eaf7;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .map-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f2744;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .map-legend {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .legend-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #64748b; font-weight: 500;
        }
        .legend-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Pollution table */
        .table-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 20px rgba(10,61,122,0.08);
          border: 1px solid #e1eaf7;
          overflow: hidden;
          margin-bottom: 28px;
        }
        .table-header {
          padding: 18px 24px;
          border-bottom: 1px solid #e1eaf7;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .gd-table { width: 100%; border-collapse: collapse; }
        .gd-table thead tr {
          background: #f8faff;
          border-bottom: 1px solid #e1eaf7;
        }
        .gd-table th {
          padding: 12px 18px;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: left;
        }
        .gd-table td {
          padding: 13px 18px;
          font-size: 13.5px;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
          font-weight: 500;
        }
        .gd-table tr:last-child td { border-bottom: none; }
        .gd-table tr:hover td { background: #f8faff; }
        .status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }
        .status-badge.critical { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .status-badge.moderate { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
        .status-badge.good     { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

        /* Complaints */
        .complaints-toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          align-items: center;
        }
        .search-input {
          flex: 1;
          min-width: 200px;
          padding: 10px 16px;
          border: 1px solid #e1eaf7;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0f2744;
          outline: none;
          transition: border-color 0.2s;
          background: #fff;
        }
        .search-input:focus { border-color: #1565c0; box-shadow: 0 0 0 3px rgba(21,101,192,0.08); }
        .filter-btn {
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid #e1eaf7;
          background: #fff;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }
        .filter-btn.active { background: #1565c0; color: #fff; border-color: #1565c0; }
        .filter-btn:hover:not(.active) { border-color: #1565c0; color: #1565c0; }

        .complaint-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e1eaf7;
          margin-bottom: 14px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(10,61,122,0.05);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .complaint-card:hover { box-shadow: 0 6px 20px rgba(10,61,122,0.1); transform: translateY(-1px); }
        .complaint-card.resolved { border-left: 3px solid #22c55e; opacity: 0.8; }
        .complaint-card.pending  { border-left: 3px solid #f59e0b; }
        .complaint-card.critical-sev { border-left: 3px solid #ef4444; }

        .complaint-header {
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f1f5f9;
          background: #fafcff;
        }
        .complaint-subject {
          font-size: 14px;
          font-weight: 700;
          color: #0f2744;
        }
        .complaint-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sev-chip {
          padding: 3px 9px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .sev-high   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .sev-medium { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
        .sev-low    { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

        .complaint-body { padding: 16px 20px; }
        .complaint-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 12px;
        }
        .complaint-field { }
        .cf-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
        .cf-value { font-size: 13px; color: #334155; font-weight: 500; }
        .complaint-desc {
          background: #f8faff;
          border: 1px solid #e1eaf7;
          border-radius: 8px;
          padding: 12px;
          font-size: 13px;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 14px;
        }
        .complaint-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .issue-tag {
          display: inline-flex; align-items: center; gap: 5px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
        }
        .resolve-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 18px;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(22,163,74,0.3);
        }
        .resolve-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(22,163,74,0.4); }
        .resolved-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #16a34a;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
        }

        /* Empty state */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }
        .empty-icon { font-size: 48px; margin-bottom: 12px; }
        .empty-title { font-size: 16px; font-weight: 600; color: #64748b; margin-bottom: 6px; }
        .empty-sub { font-size: 13px; }

        /* Overview grid */
        .overview-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 28px;
        }
        .overview-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e1eaf7;
          box-shadow: 0 2px 12px rgba(10,61,122,0.06);
          overflow: hidden;
        }
        .ov-card-header {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
          font-weight: 700;
          color: #0f2744;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ov-card-body { padding: 16px 20px; }

        /* Progress bars */
        .prog-row { margin-bottom: 14px; }
        .prog-label {
          display: flex;
          justify-content: space-between;
          font-size: 12.5px;
          color: #475569;
          font-weight: 500;
          margin-bottom: 6px;
        }
        .prog-track {
          height: 8px;
          background: #f1f5f9;
          border-radius: 8px;
          overflow: hidden;
        }
        .prog-fill {
          height: 100%;
          border-radius: 8px;
          transition: width 1s ease;
        }

        /* Alert strip */
        .alert-strip {
          background: linear-gradient(135deg, #fef2f2, #fff5f5);
          border: 1px solid #fecaca;
          border-left: 4px solid #ef4444;
          border-radius: 12px;
          padding: 14px 18px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 20px;
          font-size: 13.5px;
          color: #7f1d1d;
        }

        @media (max-width: 900px) {
          .gd-main { padding: 20px; }
          .gd-hero { padding: 28px 20px 0; }
          .stats-bar { grid-template-columns: 1fr 1fr; }
          .gd-nav { padding: 0 20px; overflow-x: auto; }
          .overview-grid { grid-template-columns: 1fr; }
          .complaint-grid { grid-template-columns: 1fr 1fr; }
          .gd-header { padding: 0 20px; }
        }
      `}</style>

      <div className="gd-root">

        {/* Header */}
        <header className="gd-header">
          <div className="header-left">
            <div className="gov-logo">🏛️</div>
            <div>
              <div className="gov-title">Yamuna Pollution Monitor</div>
              <div className="gov-subtitle">Government Control Panel</div>
            </div>
          </div>
          <div className="header-right">
            <div className="official-chip">
              <div className="official-avatar">{userName?.[0]?.toUpperCase() || 'G'}</div>
              {userName || 'Official'}
            </div>
            <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>
        </header>

        {/* Hero */}
        <div className="gd-hero">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <div className="live-dot-w" />
                Real-time Monitoring Active
              </div>
              <h1 className="hero-title">
                Yamuna River<br />
                <span>Pollution Command Centre</span>
              </h1>
              <p className="hero-sub">
                Monitor water quality, manage citizen complaints, and coordinate response across all monitoring stations.
              </p>
            </div>
          </div>
          <svg className="hero-wave" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: 50, display: 'block', marginTop: 24 }}>
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z" fill="#f0f7ff" />
          </svg>
        </div>

        {/* Stats bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-icon-box blue">📊</div>
            <div>
              <div className="stat-num">{data.length}</div>
              <div className="stat-lbl">Monitoring Stations</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-box red">🔴</div>
            <div>
              <div className="stat-num" style={{ color: '#dc2626' }}>{critical}</div>
              <div className="stat-lbl">Critical Zones</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-box green">✅</div>
            <div>
              <div className="stat-num" style={{ color: '#16a34a' }}>{safe}</div>
              <div className="stat-lbl">Safe Zones</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-box amber">📢</div>
            <div>
              <div className="stat-num" style={{ color: '#d97706' }}>{pending}</div>
              <div className="stat-lbl">Pending Complaints</div>
            </div>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="gd-nav">
          {[
            { id: 'overview', label: 'Overview', icon: '🗺️' },
            { id: 'map', label: 'Pollution Map', icon: '📍' },
            { id: 'data', label: 'Water Quality Data', icon: '🧪' },
            { id: 'complaints', label: 'Complaints', icon: '📢', count: pending, countRed: true },
          ].map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
              {tab.count > 0 && (
                <span className={`nav-badge ${tab.countRed ? 'red' : ''}`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Main */}
        <div className="gd-main">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              <div className="alert-strip">
                <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
                <div>
                  <strong>Active Alert:</strong> Multiple stations near Wazirabad, ITO Bridge, and Okhla are reporting critically high BOD and low dissolved oxygen levels. Immediate field inspection recommended.
                </div>
              </div>

              <div className="overview-grid">
                {/* Water quality summary */}
                <div className="overview-card">
                  <div className="ov-card-header">🧪 Water Quality Summary</div>
                  <div className="ov-card-body">
                    {[
                      { label: 'Critical Stations', val: critical, total: data.length, color: '#ef4444' },
                      { label: 'Moderate Stations', val: data.filter(d => d.color === 'Yellow').length, total: data.length, color: '#f59e0b' },
                      { label: 'Safe Stations', val: safe, total: data.length, color: '#22c55e' },
                    ].map(p => (
                      <div key={p.label} className="prog-row">
                        <div className="prog-label">
                          <span>{p.label}</span>
                          <span style={{ color: p.color, fontWeight: 700 }}>{p.val} / {p.total}</span>
                        </div>
                        <div className="prog-track">
                          <div className="prog-fill" style={{ width: `${data.length ? (p.val / data.length) * 100 : 0}%`, background: p.color }} />
                        </div>
                      </div>
                    ))}

                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Key Parameters (Avg)</div>
                      {[
                        { label: 'pH', val: data.length ? (data.reduce((a, b) => a + (parseFloat(b.ph) || 0), 0) / data.length).toFixed(1) : 'N/A', unit: '', safe: '6.5–8.5' },
                        { label: 'Ammonia', val: data.length ? (data.reduce((a, b) => a + (parseFloat(b.ammonia) || 0), 0) / data.length).toFixed(2) : 'N/A', unit: 'mg/L', safe: '<1' },
                        { label: 'Turbidity', val: data.length ? (data.reduce((a, b) => a + (parseFloat(b.turbidity) || 0), 0) / data.length).toFixed(1) : 'N/A', unit: 'NTU', safe: '<5' },
                      ].map(p => (
                        <div key={p.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid #f8faff', color: '#334155' }}>
                          <span style={{ color: '#64748b' }}>{p.label}</span>
                          <span style={{ fontWeight: 700 }}>{p.val} {p.unit} <span style={{ color: '#94a3b8', fontWeight: 400 }}>(safe: {p.safe})</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Complaint summary */}
                <div className="overview-card">
                  <div className="ov-card-header">📢 Complaint Summary</div>
                  <div className="ov-card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                      {[
                        { label: 'Total Filed', val: complaints.length, color: '#1565c0', bg: '#eff6ff' },
                        { label: 'Pending', val: pending, color: '#d97706', bg: '#fffbeb' },
                        { label: 'Resolved', val: resolved, color: '#16a34a', bg: '#f0fdf4' },
                        { label: 'Resolution Rate', val: complaints.length ? `${Math.round((resolved / complaints.length) * 100)}%` : '0%', color: '#7c3aed', bg: '#f5f3ff' },
                      ].map(s => (
                        <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '14px', textAlign: 'center' }}>
                          <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: -1 }}>{s.val}</div>
                          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, marginTop: 3 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    {complaints.slice(0, 3).map((c, i) => {
                      const p = parseComplaint(c.text);
                      return (
                        <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{p.subject || 'Complaint'}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{p.location || 'Unknown location'}</div>
                          </div>
                          <span className={`sev-chip ${c.resolved ? 'sev-low' : 'sev-high'}`}>
                            {c.resolved ? 'Resolved' : 'Pending'}
                          </span>
                        </div>
                      );
                    })}
                    <button
                      onClick={() => setActiveTab('complaints')}
                      style={{ width: '100%', marginTop: 14, padding: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 9, color: '#1565c0', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                      View All Complaints →
                    </button>
                  </div>
                </div>
              </div>

              {/* River image strip */}
              <div style={{
                background: 'linear-gradient(135deg, #0a3d7a, #1565c0)',
                borderRadius: 16,
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                marginBottom: 28,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ fontSize: 48 }}>🌊</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Yamuna River — Delhi Stretch</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', maxWidth: 500 }}>
                    The Delhi stretch of Yamuna (22 km) receives 80% of total pollution load despite being only 2% of the river's length. Immediate intervention is critical.
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#7dd3fc' }}>22 km</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Delhi Stretch</div>
                </div>
                <div style={{ position: 'absolute', right: 120, top: 0, bottom: 0, width: 200, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03))', pointerEvents: 'none' }} />
              </div>
            </>
          )}

          {/* MAP TAB */}
          {activeTab === 'map' && (
            <>
              <div className="sec-title">📍 Yamuna Pollution Map</div>
              <p className="sec-sub">Real-time water quality monitoring across all stations. Click markers for detailed readings.</p>
              <div className="map-card">
                <div className="map-header">
                  <div className="map-title">🗺️ Live Station Map</div>
                  <div className="map-legend">
                    <div className="legend-item"><div className="legend-dot" style={{ background: '#22c55e' }} /> Good</div>
                    <div className="legend-item"><div className="legend-dot" style={{ background: '#f59e0b' }} /> Moderate</div>
                    <div className="legend-item"><div className="legend-dot" style={{ background: '#ef4444' }} /> Critical</div>
                  </div>
                </div>
                <iframe
                  src={`${BACKEND}/api/map`}
                  width="100%"
                  height="520"
                  title="Pollution Map"
                  style={{ border: 'none', display: 'block' }}
                />
              </div>
            </>
          )}

          {/* DATA TAB */}
          {activeTab === 'data' && (
            <>
              <div className="sec-title">🧪 Water Quality Metrics</div>
              <p className="sec-sub">Detailed pollution readings from all monitoring stations across the Yamuna river.</p>
              <div className="table-card">
                <div className="table-header">
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f2744' }}>Station Readings</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{data.length} stations monitored</div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="gd-table">
                    <thead>
                      <tr>
                        <th>Location</th>
                        <th>pH</th>
                        <th>BOD (mg/L)</th>
                        <th>DO (mg/L)</th>
                        <th>Turbidity (NTU)</th>
                        <th>Ammonia (mg/L)</th>
                        <th>Phosphate (mg/L)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((d, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600, color: '#0f2744', maxWidth: 200 }}>{d.location}</td>
                          <td>{d.ph}</td>
                          <td>{d.bod || '—'}</td>
                          <td>{d.do_level || '—'}</td>
                          <td>{d.turbidity}</td>
                          <td>{d.ammonia}</td>
                          <td>{d.phosphate}</td>
                          <td>
                            <span className={`status-badge ${d.color === 'Red' ? 'critical' : d.color === 'Yellow' ? 'moderate' : 'good'}`}>
                              {d.color === 'Red' ? '🔴 Critical' : d.color === 'Yellow' ? '🟡 Moderate' : '🟢 Good'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* COMPLAINTS TAB */}
          {activeTab === 'complaints' && (
            <>
              <div className="sec-title">📢 Citizen Complaints</div>
              <p className="sec-sub">Review and resolve pollution complaints submitted by citizens. Prioritize critical severity reports.</p>

              <div className="complaints-toolbar">
                <input
                  className="search-input"
                  placeholder="🔍 Search complaints..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {['all', 'pending', 'resolved'].map(f => (
                  <button
                    key={f}
                    className={`filter-btn ${filterStatus === f ? 'active' : ''}`}
                    onClick={() => setFilterStatus(f)}
                  >
                    {f === 'all' ? `All (${complaints.length})` : f === 'pending' ? `Pending (${pending})` : `Resolved (${resolved})`}
                  </button>
                ))}
              </div>

              {filteredComplaints.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <div className="empty-title">No complaints found</div>
                  <div className="empty-sub">Try changing the filter or search query</div>
                </div>
              ) : (
                filteredComplaints.map((c, idx) => {
                  const p = parseComplaint(c.text);
                  const sevClass = p.severity === 'HIGH' ? 'critical-sev' : 'pending';
                  return (
                    <div key={idx} className={`complaint-card ${c.resolved ? 'resolved' : p.severity === 'HIGH' ? 'critical-sev' : 'pending'}`}>
                      <div className="complaint-header">
                        <div className="complaint-subject">
                          {p.subject || `Complaint #${idx + 1}`}
                        </div>
                        <div className="complaint-meta">
                          {p.severity && (
                            <span className={`sev-chip ${p.severity === 'HIGH' ? 'sev-high' : p.severity === 'MEDIUM' ? 'sev-medium' : 'sev-low'}`}>
                              {p.severity}
                            </span>
                          )}
                          {c.resolved ? (
                            <span className="resolved-badge">✓ Resolved</span>
                          ) : (
                            <span className="sev-chip sev-medium">Pending</span>
                          )}
                        </div>
                      </div>
                      <div className="complaint-body">
                        <div className="complaint-grid">
                          {p.name && (
                            <div className="complaint-field">
                              <div className="cf-label">👤 Citizen</div>
                              <div className="cf-value">{p.name}</div>
                            </div>
                          )}
                          {p.location && (
                            <div className="complaint-field">
                              <div className="cf-label">📍 Location</div>
                              <div className="cf-value">{p.location}</div>
                            </div>
                          )}
                          {p.phone && (
                            <div className="complaint-field">
                              <div className="cf-label">📞 Contact</div>
                              <div className="cf-value">{p.phone}</div>
                            </div>
                          )}
                          {p.email && (
                            <div className="complaint-field">
                              <div className="cf-label">📧 Email</div>
                              <div className="cf-value">{p.email}</div>
                            </div>
                          )}
                        </div>
                        {p.issue && (
                          <div className="complaint-desc">{p.issue}</div>
                        )}
                        <div className="complaint-footer">
                          {p.issueType && (
                            <span className="issue-tag">🏷️ {p.issueType}</span>
                          )}
                          {!c.resolved ? (
                            <button className="resolve-btn" onClick={() => markResolved(c._id)}>
                              ✅ Mark as Resolved
                            </button>
                          ) : (
                            <span className="resolved-badge">✓ Issue Resolved</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
