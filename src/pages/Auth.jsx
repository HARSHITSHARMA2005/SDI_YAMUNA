import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND = 'https://sdi-finals.onrender.com';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const strengthColor = ['#ef4444', '#f59e0b', '#eab308', '#22c55e'];
const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'];

export default function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [showPw, setShowPw] = useState(false);
  const [showGovCode, setShowGovCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const [login, setLogin] = useState({ email: '', password: '' });
  const [signup, setSignup] = useState({ name: '', email: '', password: '', role: 'public', govCode: '' });

  // Handle Google OAuth callback token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');
    const name = params.get('name');
    const error = params.get('error');

    if (token && role) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name || '');
      showToast('success', `Welcome ${name || ''}! Redirecting…`);
      setTimeout(() => navigate(role === 'government' ? '/gov-dashboard' : '/user-dashboard'), 1200);
    }

    if (error) {
      showToast('error', 'Google Sign-In failed. Please try again.');
    }
  }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const switchTab = (t) => {
    setTab(t);
    setErrors({});
  };

  // ── LOGIN ──────────────────────────────────────────────────
  const handleLogin = async () => {
    const e = {};
    if (!login.email) e.email = 'Email is required';
    else if (!isValidEmail(login.email)) e.email = 'Enter a valid email address';
    if (!login.password) e.password = 'Password is required';
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND}/api/auth/login`, login);
      const { token, role, name } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name || '');
      showToast('success', 'Login successful! Redirecting…');
      setTimeout(() => navigate(role === 'government' ? '/gov-dashboard' : '/user-dashboard'), 1200);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── GOOGLE LOGIN ───────────────────────────────────────────
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND}/api/auth/google`;
  };

  // ── SIGNUP ─────────────────────────────────────────────────
  const handleSignup = async () => {
    const e = {};
    if (!signup.name.trim() || signup.name.trim().length < 2) e.name = 'Full name must be at least 2 characters';
    if (!signup.email) e.email = 'Email is required';
    else if (!isValidEmail(signup.email)) e.email = 'Enter a valid email address';
    if (!signup.password) e.password = 'Password is required';
    else if (signup.password.length < 8) e.password = 'Minimum 8 characters';
    else if (getStrength(signup.password) < 2) e.password = 'Add uppercase, numbers or symbols';
    if (signup.role === 'government' && !signup.govCode) e.govCode = 'Government access code is required';
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      await axios.post(`${BACKEND}/api/auth/signup`, signup);
      showToast('success', 'Account created! Please log in.');
      setTimeout(() => {
        switchTab('login');
        setSignup({ name: '', email: '', password: '', role: 'public', govCode: '' });
      }, 1200);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = getStrength(signup.password);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Nunito:wght@300;400;500;600;700&display=swap');

        .auth-wrap {
          min-height: 100vh;
          background: #020d1a;
          display: flex;
          font-family: 'Nunito', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .auth-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(ellipse at 15% 50%, rgba(0,80,180,0.22) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 20%, rgba(0,160,220,0.14) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 85%, rgba(140,50,0,0.1) 0%, transparent 50%);
          animation: bgDrift 20s ease-in-out infinite alternate;
        }
        @keyframes bgDrift {
          from { transform: scale(1); }
          to   { transform: scale(1.06); }
        }
        .auth-left {
          position: relative;
          z-index: 2;
          width: 52%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 56px;
          border-right: 1px solid rgba(0,120,255,0.1);
        }
        .auth-right {
          position: relative;
          z-index: 2;
          width: 48%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 44px;
        }
        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: rgba(0,100,220,0.12);
          border: 1px solid rgba(0,150,255,0.25);
          border-radius: 100px;
          padding: 7px 16px;
          margin-bottom: 32px;
        }
        .live-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #00d4ff;
          box-shadow: 0 0 8px #00d4ff;
          animation: livePulse 2s infinite;
        }
        @keyframes livePulse {
          0%,100% { box-shadow: 0 0 6px #00d4ff; }
          50%      { box-shadow: 0 0 18px #00d4ff, 0 0 32px rgba(0,212,255,0.4); }
        }
        .live-text {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #7dd3fc;
          font-weight: 600;
        }
        .hero-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(28px, 3.5vw, 48px);
          font-weight: 700;
          color: #fff;
          line-height: 1.18;
          margin-bottom: 18px;
        }
        .hero-title .accent { color: #00d4ff; }
        .hero-sub {
          font-size: 15px;
          color: rgba(170,205,255,0.7);
          line-height: 1.8;
          max-width: 370px;
          margin-bottom: 40px;
          font-weight: 300;
        }
        .stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          max-width: 370px;
          margin-bottom: 28px;
        }
        .stat {
          background: rgba(0,60,140,0.2);
          border: 1px solid rgba(0,120,255,0.18);
          border-radius: 12px;
          padding: 16px;
          transition: border-color 0.3s;
        }
        .stat:hover { border-color: rgba(0,200,255,0.4); }
        .stat-val {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 700;
          color: #00d4ff;
        }
        .stat-lbl {
          font-size: 11px;
          color: rgba(140,190,255,0.55);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 3px;
        }
        .poll-strip {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 11px 15px;
          background: rgba(180,40,0,0.08);
          border: 1px solid rgba(255,90,40,0.18);
          border-radius: 10px;
          max-width: 370px;
        }
        .poll-dot {
          width: 9px; height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .poll-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: rgba(255,180,140,0.75);
        }
        .card {
          width: 100%;
          max-width: 420px;
          animation: cardUp 0.6s ease both;
        }
        @keyframes cardUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .card-title {
          font-family: 'Cinzel', serif;
          font-size: 21px;
          color: #e0f0ff;
          margin-bottom: 4px;
        }
        .card-sub {
          font-size: 13px;
          color: rgba(130,180,240,0.6);
          margin-bottom: 26px;
          font-weight: 300;
        }
        .tabs {
          display: flex;
          background: rgba(0,25,65,0.7);
          border: 1px solid rgba(0,90,200,0.18);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
        }
        .tab {
          flex: 1;
          padding: 10px 0;
          border: none;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
        }
        .tab.on {
          background: linear-gradient(135deg, #0055cc, #0099ff);
          color: #fff;
          box-shadow: 0 4px 14px rgba(0,100,255,0.35);
        }
        .tab.off {
          background: transparent;
          color: rgba(140,190,255,0.55);
        }
        .tab.off:hover { color: #7dd3fc; }
        .google-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06);
          color: #e0f0ff;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
          margin-bottom: 6px;
        }
        .google-btn:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-1px);
        }
        .google-icon {
          width: 18px; height: 18px;
        }
        .fg { margin-bottom: 16px; }
        .fl {
          display: block;
          font-size: 11.5px;
          font-weight: 600;
          color: rgba(140,190,255,0.65);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 7px;
        }
        .fi {
          width: 100%;
          padding: 12px 15px;
          background: rgba(0,25,65,0.55);
          border: 1px solid rgba(0,90,200,0.22);
          border-radius: 9px;
          color: #ddeeff;
          font-size: 14.5px;
          font-family: 'Nunito', sans-serif;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .fi::placeholder { color: rgba(90,140,200,0.4); }
        .fi:focus {
          border-color: rgba(0,170,255,0.55);
          box-shadow: 0 0 0 3px rgba(0,140,255,0.1);
        }
        .fi.err { border-color: rgba(239,68,68,0.55); }
        .ferr { font-size: 11.5px; color: #f87171; margin-top: 4px; }
        .role-row { display: flex; gap: 10px; margin-bottom: 16px; }
        .role-pill {
          flex: 1;
          padding: 10px 0;
          border-radius: 9px;
          border: 1px solid rgba(0,90,200,0.22);
          background: rgba(0,25,65,0.4);
          color: rgba(140,190,255,0.55);
          font-size: 13px;
          font-weight: 600;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          text-align: center;
          transition: all 0.25s;
        }
        .role-pill.sel {
          background: rgba(0,70,180,0.35);
          border-color: rgba(0,180,255,0.45);
          color: #7dd3fc;
          box-shadow: 0 0 12px rgba(0,140,255,0.15);
        }
        .pw-wrap { position: relative; }
        .pw-toggle {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(100,155,220,0.6);
          font-size: 15px;
          padding: 0;
        }
        .pw-toggle:hover { color: #7dd3fc; }
        .str-bar {
          height: 3px;
          background: rgba(0,60,140,0.25);
          border-radius: 3px;
          margin-top: 6px;
          overflow: hidden;
        }
        .str-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.4s, background 0.4s;
        }
        .str-label { font-size: 11px; margin-top: 3px; }
        .sub-btn {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #0050cc, #0099ff);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 18px rgba(0,100,255,0.32);
          margin-top: 6px;
          position: relative;
          overflow: hidden;
        }
        .sub-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(0,120,255,0.45); }
        .sub-btn:active { transform: translateY(0); }
        .sub-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
        .toast {
          position: fixed;
          top: 22px; right: 22px;
          z-index: 9999;
          padding: 13px 18px;
          border-radius: 11px;
          font-size: 13.5px;
          font-weight: 600;
          font-family: 'Nunito', sans-serif;
          display: flex;
          align-items: center;
          gap: 9px;
          animation: toastIn 0.35s ease;
          box-shadow: 0 8px 28px rgba(0,0,0,0.45);
          max-width: 320px;
        }
        .toast.ok {
          background: rgba(4,50,18,0.96);
          border: 1px solid rgba(34,197,94,0.45);
          color: #86efac;
        }
        .toast.fail {
          background: rgba(60,8,8,0.96);
          border: 1px solid rgba(239,68,68,0.45);
          color: #fca5a5;
        }
        @keyframes toastIn {
          from { opacity:0; transform:translateX(36px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .divider {
          display: flex; align-items: center; gap: 10px;
          margin: 18px 0;
        }
        .div-line { flex:1; height:1px; background:rgba(0,80,180,0.15); }
        .div-txt { font-size:11px; color:rgba(90,140,200,0.4); letter-spacing:1px; }
        .gov-note {
          font-size: 12px;
          color: rgba(250,200,100,0.7);
          background: rgba(180,120,0,0.1);
          border: 1px solid rgba(250,180,0,0.2);
          border-radius: 8px;
          padding: 8px 12px;
          margin-bottom: 14px;
        }
        @media (max-width: 768px) {
          .auth-left { display: none; }
          .auth-right { width: 100%; padding: 36px 24px; }
        }
      `}</style>

      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'ok' : 'fail'}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.msg}
        </div>
      )}

      <div className="auth-wrap">
        <div className="auth-bg" />

        {/* ── LEFT PANEL ── */}
        <div className="auth-left">
          <div className="live-badge">
            <div className="live-dot" />
            <span className="live-text">Live Monitoring Active</span>
          </div>
          <h1 className="hero-title">
            Safeguarding the<br />
            <span className="accent">Sacred Yamuna</span>
          </h1>
          <p className="hero-sub">
            Real-time pollution tracking, citizen reporting, and government
            response — all in one platform dedicated to restoring India's
            most revered river.
          </p>
          <div className="stats">
            <div className="stat">
              <div className="stat-val">48+</div>
              <div className="stat-lbl">Monitoring Points</div>
            </div>
            <div className="stat">
              <div className="stat-val">72%</div>
              <div className="stat-lbl">Stretch Polluted</div>
            </div>
            <div className="stat">
              <div className="stat-val">3.5B</div>
              <div className="stat-lbl">Litres/Day Sewage</div>
            </div>
            <div className="stat">
              <div className="stat-val">24/7</div>
              <div className="stat-lbl">Active Tracking</div>
            </div>
          </div>
          <div className="poll-strip">
            <div className="poll-item">
              <div className="poll-dot" style={{ background: '#ef4444', boxShadow: '0 0 7px #ef4444' }} />
              Critical
            </div>
            <div className="poll-item">
              <div className="poll-dot" style={{ background: '#f59e0b', boxShadow: '0 0 7px #f59e0b' }} />
              Moderate
            </div>
            <div className="poll-item">
              <div className="poll-dot" style={{ background: '#22c55e', boxShadow: '0 0 7px #22c55e' }} />
              Safe
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,170,120,0.6)', marginLeft: 'auto' }}>
              Current Zone Status
            </span>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="auth-right">
          <div className="card">
            <h2 className="card-title">
              {tab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="card-sub">
              {tab === 'login'
                ? 'Sign in to access your dashboard'
                : 'Join the Yamuna monitoring network'}
            </p>

            <div className="tabs">
              <button className={`tab ${tab === 'login' ? 'on' : 'off'}`} onClick={() => switchTab('login')}>
                Login
              </button>
              <button className={`tab ${tab === 'signup' ? 'on' : 'off'}`} onClick={() => switchTab('signup')}>
                Sign Up
              </button>
            </div>

            {/* Google Button */}
            <button className="google-btn" onClick={handleGoogleLogin}>
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="divider">
              <div className="div-line" /><span className="div-txt">OR</span><div className="div-line" />
            </div>

            {/* ── LOGIN FORM ── */}
            {tab === 'login' && (
              <>
                <div className="fg">
                  <label className="fl">Email Address</label>
                  <input
                    className={`fi ${errors.email ? 'err' : ''}`}
                    type="email"
                    placeholder="you@example.com"
                    value={login.email}
                    onChange={e => setLogin({ ...login, email: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  />
                  {errors.email && <div className="ferr">{errors.email}</div>}
                </div>
                <div className="fg">
                  <label className="fl">Password</label>
                  <div className="pw-wrap">
                    <input
                      className={`fi ${errors.password ? 'err' : ''}`}
                      type={showPw ? 'text' : 'password'}
                      placeholder="Your password"
                      value={login.password}
                      onChange={e => setLogin({ ...login, password: e.target.value })}
                      style={{ paddingRight: 40 }}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    />
                    <button className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <div className="ferr">{errors.password}</div>}
                </div>
                <button className="sub-btn" onClick={handleLogin} disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
                <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(130,180,240,0.6)', marginTop: 16 }}>
                  Don't have an account?{' '}
                  <span onClick={() => switchTab('signup')} style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: 600 }}>
                    Sign Up
                  </span>
                </p>
              </>
            )}

            {/* ── SIGNUP FORM ── */}
            {tab === 'signup' && (
              <>
                <div className="fg">
                  <label className="fl">Full Name</label>
                  <input
                    className={`fi ${errors.name ? 'err' : ''}`}
                    type="text"
                    placeholder="Your full name"
                    value={signup.name}
                    onChange={e => setSignup({ ...signup, name: e.target.value })}
                  />
                  {errors.name && <div className="ferr">{errors.name}</div>}
                </div>
                <div className="fg">
                  <label className="fl">Email Address</label>
                  <input
                    className={`fi ${errors.email ? 'err' : ''}`}
                    type="email"
                    placeholder="you@example.com"
                    value={signup.email}
                    onChange={e => setSignup({ ...signup, email: e.target.value })}
                  />
                  {errors.email && <div className="ferr">{errors.email}</div>}
                </div>
                <div className="fg">
                  <label className="fl">Password</label>
                  <div className="pw-wrap">
                    <input
                      className={`fi ${errors.password ? 'err' : ''}`}
                      type={showPw ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={signup.password}
                      onChange={e => setSignup({ ...signup, password: e.target.value })}
                      style={{ paddingRight: 40 }}
                    />
                    <button className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {signup.password && (
                    <>
                      <div className="str-bar">
                        <div className="str-fill" style={{ width: `${(pwStrength / 4) * 100}%`, background: strengthColor[pwStrength - 1] || '#ef4444' }} />
                      </div>
                      <div className="str-label" style={{ color: strengthColor[pwStrength - 1] || '#ef4444' }}>
                        {strengthLabel[pwStrength - 1] || 'Too weak'}
                      </div>
                    </>
                  )}
                  {errors.password && <div className="ferr">{errors.password}</div>}
                </div>
                <div className="fg">
                  <label className="fl">Account Type</label>
                  <div className="role-row">
                    <button
                      className={`role-pill ${signup.role === 'public' ? 'sel' : ''}`}
                      onClick={() => setSignup({ ...signup, role: 'public', govCode: '' })}
                    >
                      🌊 Citizen
                    </button>
                    <button
                      className={`role-pill ${signup.role === 'government' ? 'sel' : ''}`}
                      onClick={() => setSignup({ ...signup, role: 'government' })}
                    >
                      🏛️ Government
                    </button>
                  </div>
                </div>

                {signup.role === 'government' && (
                  <>
                    <div className="gov-note">
                      🔒 Government accounts require an official access code provided by the system administrator.
                    </div>
                    <div className="fg">
                      <label className="fl">Government Access Code</label>
                      <div className="pw-wrap">
                        <input
                          className={`fi ${errors.govCode ? 'err' : ''}`}
                          type={showGovCode ? 'text' : 'password'}
                          placeholder="Enter access code"
                          value={signup.govCode}
                          onChange={e => setSignup({ ...signup, govCode: e.target.value })}
                          style={{ paddingRight: 40 }}
                        />
                        <button className="pw-toggle" onClick={() => setShowGovCode(!showGovCode)}>
                          {showGovCode ? '🙈' : '👁️'}
                        </button>
                      </div>
                      {errors.govCode && <div className="ferr">{errors.govCode}</div>}
                    </div>
                  </>
                )}

                <button className="sub-btn" onClick={handleSignup} disabled={loading}>
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
                <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(130,180,240,0.6)', marginTop: 16 }}>
                  Already have an account?{' '}
                  <span onClick={() => switchTab('login')} style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: 600 }}>
                    Sign In
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}