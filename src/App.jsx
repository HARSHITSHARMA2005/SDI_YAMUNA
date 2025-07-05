import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Main from './pages/Main';
import  Login  from './pages/Login';
import  Signup  from './pages/Signup';
import GovDashboard from './pages/GovDashboard';
import UserDashboard from './pages/userDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/gov-dashboard"
          element={
            token && role === 'government' ? <GovDashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/user-dashboard"
          element={
            token && role === 'public' ? <UserDashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
