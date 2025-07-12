import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ user, handleLogout, notifications }) => {
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <nav className="bg-white border-b border-soGray p-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-2xl font-bold text-soDarkGray">StackIt</Link>
        <input
          type="text"
          placeholder="Search..."
          className="border border-soGray rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-soBlue"
        />
      </div>
      <div className="flex items-center space-x-2">
        {user ? (
          <>
            <span className="text-sm text-soDarkGray">Welcome, {user.username}</span>
            <Link to="/ask" className="btn-so">Ask Question</Link>
            {user.role === 'admin' && (
              <button
                onClick={async () => {
                  const message = prompt('Enter broadcast message:');
                  if (message) {
                    try {
                      await axios.post('http://localhost:5000/api/admin/broadcast', { message }, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                      });
                      alert('Broadcast sent');
                    } catch (err) {
                      alert('Failed to send broadcast');
                    }
                  }
                }}
                className="btn-so-outline"
              >
                Broadcast
              </button>
            )}
            <button onClick={handleLogout} className="btn-so-outline">Logout</button>
            <div className="relative">
              <span className="cursor-pointer text-xl text-soDarkGray">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">{unreadCount}</span>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-so-outline">Login</Link>
            <Link to="/login?register=true" className="btn-so">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;