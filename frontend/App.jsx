import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import AuthForm from './components/AuthForm.jsx';
import QuestionForm from './components/QuestionForm.jsx';
import QuestionList from './components/QuestionList.jsx';
import NotificationDropdown from './components/NotificationDropdown.jsx';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-soLightGray">
        <Navbar user={user} handleLogout={handleLogout} notifications={notifications} />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-4 max-w-5xl mx-auto">
            <Routes>
              <Route path="/login" element={<AuthForm setUser={setUser} setToken={setToken} />} />
              <Route path="/ask" element={<QuestionForm token={token} />} />
              <Route path="/" element={<QuestionList token={token} user={user} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;