import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND = 'https://sdi-finals.onrender.com';

const ISSUE_TYPES = [
  { value: 'industrial', label: '🏭 Industrial Discharge', color: '#ef4444' },
  { value: 'sewage', label: '🚰 Sewage Overflow', color: '#f59e0b' },
  { value: 'solid_waste', label: '🗑️ Solid Waste Dumping', color: '#f97316' },
  { value: 'chemical', label: '⚗️ Chemical Pollution', color: '#a855f7' },
  { value: 'oil_spill', label: '🛢️ Oil / Fuel Spill', color: '#6366f1' },
  { value: 'encroachment', label: '🏗️ River Encroachment', color: '#ec4899' },
  { value: 'other', label: '⚠️ Other Issue', color: '#64748b' },
];

const YAMUNA_LOCATIONS = [
  'Yamunotri (Source)', 'Dakpathar Barrage', 'Tajewala Barrage',
  'Panipat', 'Sonipat', 'Wazirabad', 'Okhla', 'ITO Bridge',
  'Nizamuddin Bridge', 'Agra', 'Mathura', 'Etawah', 'Kalpi',
  'Hamirpur', 'Allahabad (Prayagraj)', 'Other Location'
];

export default function UserDashboard() {
  const [userName, setUserName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complaintCount, setComplaintCount] = useState(0);
  const [activeSection, setActiveSection] = useState('form');
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '',
    subject: '', location: '', issueType: '', issue: '', severity: 'medium',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    if (name) setUserName(name);

    if (token) {
      axios.get(`${BACKEND}/api/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setComplaintCount(res.data?.length || 0)).catch(() => {});
    }
  }, []);

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Name is required';
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) e.phone = 'Enter valid 10-digit phone';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)) e.email = 'Enter valid email';
    if (!formData.subject.trim()) e.subject = 'Subject is required';
    if (!formData.location) e.location = 'Select a location';
    if (!formData.issueType) e.issueType = 'Select issue type';
    if (!formData.issue.trim() || formData.issue.trim().length < 20) e.issue = 'Describe the issue (min 20 characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const complaintText = `
ISSUE TYPE: ${formData.issueType.toUpperCase()}
SEVERITY: ${formData.severity.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━
👤 Name: ${formData.fullName}
📞 Phone: ${formData.phone}
📧 Email: ${formData.email}
📍 Location: ${formData.location}
📝 Subject: ${formData.subject}
⚠️ Issue: ${formData.issue}
      `.trim();

      await axios.post(
        `${BACKEND}/api/complaints`,
        { text: complaintText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmitted(true);
      setComplaintCount(c => c + 1);
    } catch {
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({ fullName: '', phone: '', email: '', subject: '', location: '', issueType: '', issue: '', severity: 'medium' });
    setErrors({});
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ud-root {
          min-height: 100vh;
          background: #020d1a;
          font-family: 'DM Sans', sans-serif;
          color: #e0f0ff;
          position: relative;
          overflow-x: hidden;
        }

        /* Animated river background */
        .river-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .river-layer {
          position: absolute;
          width: 300%;
          height: 100%;
          background: repeating-linear-gradient(
            90deg,
            transparent 0px,
            rgba(0, 80, 180, 0.04) 2px,
            transparent 4px,
            transparent 40px
          );
          animation: riverFlow 12s linear infinite;
        }
        .river-layer-2 {
          position: absolute;
          width: 300%;
          height: 100%;
          background: repeating-linear-gradient(
            90deg,
            transparent 0px,
            rgba(0, 140, 220, 0.03) 1px,
            transparent 3px,
            transparent 60px
          );
          animation: riverFlow 20s linear infinite reverse;
          top: 30%;
        }
        @keyframes riverFlow {
          from { transform: translateX(0); }
          to   { transform: translateX(-66.66%); }
        }

        .glow-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .orb-1 { width: 600px; height: 600px; background: rgba(0,80,200,0.12); top: -200px; left: -100px; }
        .orb-2 { width: 400px; height: 400px; background: rgba(0,160,220,0.08); bottom: 0; right: -100px; }
        .orb-3 { width: 300px; height: 300px; background: rgba(180,60,0,0.06); top: 50%; left: 50%; }

        /* Header */
        .ud-header {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          border-bottom: 1px solid rgba(0,120,255,0.1);
          background: rgba(2,13,26,0.8);
          backdrop-filter: blur(20px);
        }
        .ud-logo {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #00d4ff;
          letter-spacing: -0.5px;
        }
        .ud-logo span { color: rgba(255,255,255,0.5); font-weight: 400; }
        .header-right { display: flex; align-items: center; gap: 16px; }
        .user-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,80,180,0.15);
          border: 1px solid rgba(0,120,255,0.2);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 13px;
          color: #7dd3fc;
        }
        .user-avatar {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0066cc, #00d4ff);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff;
        }
        .logout-btn {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #fca5a5;
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.2); }

        /* Hero */
        .ud-hero {
          position: relative;
          z-index: 2;
          padding: 56px 40px 40px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,212,255,0.08);
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #00d4ff;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .pulse-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #00d4ff;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 4px #00d4ff; }
          50% { box-shadow: 0 0 14px #00d4ff, 0 0 24px rgba(0,212,255,0.4); }
        }
        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 14px;
          color: #fff;
        }
        .hero-title .wave { color: #00d4ff; }
        .hero-title .name { color: rgba(255,255,255,0.6); }
        .hero-sub {
          font-size: 16px;
          color: rgba(160,200,255,0.65);
          max-width: 520px;
          line-height: 1.7;
          font-weight: 300;
          margin-bottom: 36px;
        }

        /* Stats row */
        .stats-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .stat-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0,40,100,0.3);
          border: 1px solid rgba(0,100,200,0.2);
          border-radius: 12px;
          padding: 12px 18px;
          transition: border-color 0.3s;
        }
        .stat-chip:hover { border-color: rgba(0,180,255,0.35); }
        .stat-icon { font-size: 20px; }
        .stat-info {}
        .stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #00d4ff;
          line-height: 1;
        }
        .stat-lbl { font-size: 11px; color: rgba(120,170,220,0.6); margin-top: 2px; }

        /* Pollution alert */
        .alert-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          border-left: 3px solid #ef4444;
          border-radius: 10px;
          padding: 14px 18px;
          margin-bottom: 40px;
          font-size: 13.5px;
          color: rgba(255,180,160,0.85);
          max-width: 700px;
        }

        /* Main layout */
        .ud-main {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 40px 60px;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 28px;
          align-items: start;
        }

        /* Form card */
        .form-card {
          background: rgba(5,20,50,0.6);
          border: 1px solid rgba(0,100,200,0.18);
          border-radius: 20px;
          padding: 36px;
          backdrop-filter: blur(20px);
        }
        .form-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #e0f0ff;
          margin-bottom: 6px;
        }
        .form-card-sub {
          font-size: 13px;
          color: rgba(120,170,220,0.55);
          margin-bottom: 28px;
          font-weight: 300;
        }

        /* Severity selector */
        .severity-row {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .sev-btn {
          flex: 1;
          padding: 9px 0;
          border-radius: 8px;
          border: 1px solid rgba(0,90,200,0.2);
          background: rgba(0,20,60,0.4);
          font-size: 12px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.25s;
          color: rgba(140,190,255,0.5);
        }
        .sev-btn.low.sel  { background: rgba(34,197,94,0.15); border-color: #22c55e; color: #86efac; }
        .sev-btn.med.sel  { background: rgba(245,158,11,0.15); border-color: #f59e0b; color: #fcd34d; }
        .sev-btn.high.sel { background: rgba(239,68,68,0.15); border-color: #ef4444; color: #fca5a5; }

        /* Issue type grid */
        .issue-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 20px;
        }
        .issue-btn {
          padding: 10px 12px;
          border-radius: 9px;
          border: 1px solid rgba(0,90,200,0.2);
          background: rgba(0,20,60,0.4);
          font-size: 12.5px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.25s;
          color: rgba(140,190,255,0.55);
          text-align: left;
        }
        .issue-btn.sel {
          background: rgba(0,60,160,0.3);
          border-color: rgba(0,160,255,0.45);
          color: #7dd3fc;
        }
        .issue-btn:hover:not(.sel) { border-color: rgba(0,120,255,0.3); color: rgba(180,220,255,0.8); }

        /* Form fields */
        .fg { margin-bottom: 18px; }
        .fg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }
        .fl {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: rgba(130,180,255,0.6);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 7px;
        }
        .fi {
          width: 100%;
          padding: 12px 14px;
          background: rgba(0,20,60,0.5);
          border: 1px solid rgba(0,90,200,0.2);
          border-radius: 9px;
          color: #ddeeff;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .fi::placeholder { color: rgba(80,130,190,0.4); }
        .fi:focus { border-color: rgba(0,160,255,0.5); box-shadow: 0 0 0 3px rgba(0,130,255,0.08); }
        .fi.err { border-color: rgba(239,68,68,0.5); }
        .fi-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230099ff' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          cursor: pointer;
        }
        .fi-select option { background: #02183a; }
        .fi-textarea { resize: vertical; min-height: 110px; line-height: 1.6; }
        .ferr { font-size: 11px; color: #f87171; margin-top: 4px; }
        .fl-req { color: #ef4444; margin-left: 3px; }

        /* Submit button */
        .submit-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 11px;
          background: linear-gradient(135deg, #0050cc, #0099ff);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(0,100,255,0.3);
          position: relative;
          overflow: hidden;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,120,255,0.45); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        /* Success state */
        .success-card {
          text-align: center;
          padding: 60px 40px;
        }
        .success-icon {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: rgba(34,197,94,0.12);
          border: 2px solid rgba(34,197,94,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
          margin: 0 auto 24px;
          animation: scaleIn 0.5s ease;
        }
        @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
        .success-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #86efac;
          margin-bottom: 10px;
        }
        .success-sub {
          font-size: 14px;
          color: rgba(130,180,220,0.65);
          line-height: 1.7;
          max-width: 320px;
          margin: 0 auto 28px;
        }
        .points-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 100px;
          padding: 8px 18px;
          font-size: 14px;
          color: #86efac;
          font-weight: 600;
          margin-bottom: 28px;
        }
        .new-complaint-btn {
          padding: 12px 28px;
          border-radius: 10px;
          border: 1px solid rgba(0,150,255,0.3);
          background: rgba(0,60,150,0.2);
          color: #7dd3fc;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.25s;
        }
        .new-complaint-btn:hover { background: rgba(0,80,180,0.35); }

        /* Sidebar */
        .sidebar { display: flex; flex-direction: column; gap: 16px; }

        .side-card {
          background: rgba(5,20,50,0.6);
          border: 1px solid rgba(0,100,200,0.15);
          border-radius: 16px;
          padding: 22px;
          backdrop-filter: blur(20px);
        }
        .side-title {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: rgba(140,190,255,0.7);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        /* Pollution level indicator */
        .poll-level {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .poll-bar-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .poll-bar-label { font-size: 12px; color: rgba(160,200,255,0.7); width: 80px; flex-shrink: 0; }
        .poll-bar-track {
          flex: 1;
          height: 6px;
          background: rgba(0,50,120,0.3);
          border-radius: 6px;
          overflow: hidden;
        }
        .poll-bar-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 1s ease;
        }
        .poll-bar-val { font-size: 11px; color: rgba(140,190,255,0.5); width: 32px; text-align: right; flex-shrink: 0; }

        /* Tips */
        .tip-list { display: flex; flex-direction: column; gap: 10px; }
        .tip-item {
          display: flex;
          gap: 10px;
          font-size: 12.5px;
          color: rgba(150,200,255,0.7);
          line-height: 1.5;
        }
        .tip-icon { flex-shrink: 0; font-size: 14px; }

        /* River status */
        .river-status-list { display: flex; flex-direction: column; gap: 8px; }
        .river-status-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12.5px;
          padding: 8px 10px;
          border-radius: 8px;
          background: rgba(0,30,80,0.3);
        }
        .river-status-name { color: rgba(160,200,255,0.8); }
        .status-pill {
          font-size: 10px;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 100px;
          letter-spacing: 0.5px;
        }
        .status-critical { background: rgba(239,68,68,0.15); color: #fca5a5; border: 1px solid rgba(239,68,68,0.25); }
        .status-moderate { background: rgba(245,158,11,0.15); color: #fcd34d; border: 1px solid rgba(245,158,11,0.25); }
        .status-safe     { background: rgba(34,197,94,0.15); color: #86efac; border: 1px solid rgba(34,197,94,0.25); }

        /* Section label */
        .section-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(100,150,220,0.5);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 10px;
          margin-top: 6px;
        }

        @media (max-width: 900px) {
          .ud-main { grid-template-columns: 1fr; }
          .sidebar { order: -1; }
          .ud-hero, .ud-main { padding-left: 20px; padding-right: 20px; }
          .fg-row { grid-template-columns: 1fr; }
          .ud-header { padding: 16px 20px; }
        }
      `}</style>

      <div className="ud-root">
        {/* Background */}
        <div className="river-bg">
          <div className="river-layer" />
          <div className="river-layer-2" />
        </div>
        <div className="glow-orb orb-1" />
        <div className="glow-orb orb-2" />
        <div className="glow-orb orb-3" />

        {/* Header */}
        <header className="ud-header">
          <div className="ud-logo">S.A.F <span>/ Yamuna Monitor</span></div>
          <div className="header-right">
            <div className="user-chip">
              <div className="user-avatar">{userName?.[0]?.toUpperCase() || 'U'}</div>
              {userName || 'Citizen'}
            </div>
            <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>
        </header>

        {/* Hero */}
        <section className="ud-hero">
          <div className="hero-eyebrow">
            <div className="pulse-dot" />
            Citizen Portal — Active
          </div>
          <h1 className="hero-title">
            Your voice protects<br />
            the <span className="wave">Yamuna</span>
            {userName && <>, <span className="name">{userName.split(' ')[0]}</span></>}
          </h1>
          <p className="hero-sub">
            Report pollution incidents directly to government officials. Every complaint triggers real action. Together, we can restore India's sacred river.
          </p>

          <div className="stats-row">
            <div className="stat-chip">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <div className="stat-val">{complaintCount}</div>
                <div className="stat-lbl">Your Reports</div>
              </div>
            </div>
            <div className="stat-chip">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <div className="stat-val">{complaintCount * 10}</div>
                <div className="stat-lbl">Clean Yamuna Points</div>
              </div>
            </div>
            <div className="stat-chip">
              <div className="stat-icon">🌊</div>
              <div className="stat-info">
                <div className="stat-val">1,247</div>
                <div className="stat-lbl">Total Reports Filed</div>
              </div>
            </div>
            <div className="stat-chip">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <div className="stat-val">342</div>
                <div className="stat-lbl">Issues Resolved</div>
              </div>
            </div>
          </div>

          <div className="alert-banner">
            <span style={{ fontSize: 20 }}>🔴</span>
            <div>
              <strong style={{ color: '#fca5a5' }}>Critical Alert:</strong> Dissolved oxygen levels near Wazirabad and ITO Bridge are below safe limits. Immediate reporting required if you witness pollution in these areas.
            </div>
          </div>
        </section>

        {/* Main */}
        <div className="ud-main">
          {/* Form */}
          <div className="form-card">
            {submitted ? (
              <div className="success-card">
                <div className="success-icon">✓</div>
                <div className="success-title">Complaint Filed!</div>
                <p className="success-sub">
                  Your report has been submitted to government officials and is now under review. You will be notified of any action taken.
                </p>
                <div className="points-badge">
                  🌱 +10 Clean Yamuna Points Earned
                </div>
                <br />
                <button className="new-complaint-btn" onClick={resetForm}>
                  + File Another Complaint
                </button>
              </div>
            ) : (
              <>
                <div className="form-card-title">📣 Submit Pollution Complaint</div>
                <p className="form-card-sub">All fields marked <span style={{ color: '#ef4444' }}>*</span> are required. Your report goes directly to officials.</p>

                {/* Severity */}
                <div className="section-label">Severity Level *</div>
                <div className="severity-row" style={{ marginBottom: 20 }}>
                  {['low', 'medium', 'high'].map(s => (
                    <button
                      key={s}
                      className={`sev-btn ${s === 'medium' ? 'med' : s === 'low' ? 'low' : 'high'} ${formData.severity === s ? 'sel' : ''}`}
                      onClick={() => setFormData({ ...formData, severity: s })}
                    >
                      {s === 'low' ? '🟢 Low' : s === 'medium' ? '🟡 Moderate' : '🔴 Critical'}
                    </button>
                  ))}
                </div>

                {/* Issue Type */}
                <div className="section-label">Issue Type *</div>
                <div className="issue-grid">
                  {ISSUE_TYPES.map(it => (
                    <button
                      key={it.value}
                      className={`issue-btn ${formData.issueType === it.value ? 'sel' : ''}`}
                      onClick={() => setFormData({ ...formData, issueType: it.value })}
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
                {errors.issueType && <div className="ferr" style={{ marginTop: -12, marginBottom: 16 }}>{errors.issueType}</div>}

                {/* Name & Phone */}
                <div className="fg-row">
                  <div>
                    <label className="fl">Full Name <span className="fl-req">*</span></label>
                    <input className={`fi ${errors.fullName ? 'err' : ''}`} type="text" placeholder="Your full name"
                      value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                    {errors.fullName && <div className="ferr">{errors.fullName}</div>}
                  </div>
                  <div>
                    <label className="fl">Phone <span className="fl-req">*</span></label>
                    <input className={`fi ${errors.phone ? 'err' : ''}`} type="tel" placeholder="10-digit number"
                      value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    {errors.phone && <div className="ferr">{errors.phone}</div>}
                  </div>
                </div>

                {/* Email */}
                <div className="fg">
                  <label className="fl">Email Address <span className="fl-req">*</span></label>
                  <input className={`fi ${errors.email ? 'err' : ''}`} type="email" placeholder="you@example.com"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  {errors.email && <div className="ferr">{errors.email}</div>}
                </div>

                {/* Location */}
                <div className="fg">
                  <label className="fl">Location near Yamuna <span className="fl-req">*</span></label>
                  <select className={`fi fi-select ${errors.location ? 'err' : ''}`}
                    value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}>
                    <option value="">Select location...</option>
                    {YAMUNA_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {errors.location && <div className="ferr">{errors.location}</div>}
                </div>

                {/* Subject */}
                <div className="fg">
                  <label className="fl">Subject <span className="fl-req">*</span></label>
                  <input className={`fi ${errors.subject ? 'err' : ''}`} type="text" placeholder="e.g., Oil leakage from factory near bridge"
                    value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                  {errors.subject && <div className="ferr">{errors.subject}</div>}
                </div>

                {/* Issue description */}
                <div className="fg">
                  <label className="fl">Detailed Description <span className="fl-req">*</span></label>
                  <textarea className={`fi fi-textarea ${errors.issue ? 'err' : ''}`}
                    placeholder="Describe the pollution issue in detail. Include time of occurrence, visible signs, affected area, etc. (minimum 20 characters)"
                    value={formData.issue} onChange={e => setFormData({ ...formData, issue: e.target.value })} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    {errors.issue ? <div className="ferr">{errors.issue}</div> : <div />}
                    <div style={{ fontSize: 11, color: 'rgba(100,150,200,0.5)' }}>{formData.issue.length} chars</div>
                  </div>
                </div>

                <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>⏳ Submitting…</>
                  ) : (
                    <>🚀 Submit Complaint to Officials</>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* River Status */}
            <div className="side-card">
              <div className="side-title">🌊 River Zone Status</div>
              <div className="river-status-list">
                {[
                  { name: 'Wazirabad', status: 'critical' },
                  { name: 'ITO Bridge', status: 'critical' },
                  { name: 'Okhla', status: 'critical' },
                  { name: 'Nizamuddin', status: 'moderate' },
                  { name: 'Mathura', status: 'moderate' },
                  { name: 'Yamunotri', status: 'safe' },
                ].map(z => (
                  <div key={z.name} className="river-status-item">
                    <span className="river-status-name">{z.name}</span>
                    <span className={`status-pill status-${z.status}`}>
                      {z.status === 'critical' ? 'CRITICAL' : z.status === 'moderate' ? 'MODERATE' : 'SAFE'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pollution Levels */}
            <div className="side-card">
              <div className="side-title">📊 Pollution Indicators</div>
              <div className="poll-level">
                {[
                  { label: 'BOD Level', val: 87, color: '#ef4444' },
                  { label: 'DO Level', val: 23, color: '#f59e0b' },
                  { label: 'pH Balance', val: 65, color: '#eab308' },
                  { label: 'Turbidity', val: 78, color: '#f97316' },
                  { label: 'Coliform', val: 92, color: '#ef4444' },
                ].map(p => (
                  <div key={p.label} className="poll-bar-row">
                    <div className="poll-bar-label">{p.label}</div>
                    <div className="poll-bar-track">
                      <div className="poll-bar-fill" style={{ width: `${p.val}%`, background: p.color }} />
                    </div>
                    <div className="poll-bar-val">{p.val}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="side-card">
              <div className="side-title">💡 Reporting Tips</div>
              <div className="tip-list">
                {[
                  { icon: '📸', text: 'Note the exact time and date of the incident for accurate records.' },
                  { icon: '📍', text: 'Be as specific as possible about the location — mention nearby landmarks.' },
                  { icon: '🏭', text: 'If possible, identify the source — factory name, drain number, etc.' },
                  { icon: '⚡', text: 'Critical severity complaints are prioritized and reviewed within 24 hours.' },
                  { icon: '🌱', text: 'Each valid complaint earns you 10 Clean Yamuna Points.' },
                ].map((t, i) => (
                  <div key={i} className="tip-item">
                    <span className="tip-icon">{t.icon}</span>
                    <span>{t.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
