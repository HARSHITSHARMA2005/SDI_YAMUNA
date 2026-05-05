import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Main from './pages/Main';
import Auth from './pages/Auth';
import GovDashboard from './pages/GovDashboard';
import UserDashboard from './pages/userDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function Layout() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const hiddenRoutes = ['/login', '/signup', '/user-dashboard', '/gov-dashboard'];
  const hideNav = hiddenRoutes.some(r => location.pathname.startsWith(r));

  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route
          path="/gov-dashboard"
          element={token && role === 'government' ? <GovDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/user-dashboard"
          element={token && role === 'public' ? <UserDashboard /> : <Navigate to="/login" />}
        />
      </Routes>
      {!hideNav && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;