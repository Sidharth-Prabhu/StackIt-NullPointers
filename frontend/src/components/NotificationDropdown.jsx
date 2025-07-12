import React, { useState } from 'react';
import axios from 'axios';

const NotificationDropdown = ({ notifications, fetchNotifications, token }) => {
  const [isOpen, setIsOpen] = useState(false);

  const markAsRead = async () => {
    try {
      await axios.post('http://localhost:5000/api/notifications/mark-read', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to mark notifications as read');
    }
  };

  return (
    <div className="relative">
      <div
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Bell icon handled in Navbar */}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded border border-soGray shadow-lg p-4 z-10">
          <h3 className="text-sm font-bold text-soDarkGray mb-2">Notifications</h3>
          {notifications.length ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-2 text-sm ${n.is_read ? 'text-gray-500' : 'text-soDarkGray font-medium'}`}
              >
                {n.content}
              </div>
            ))
          ) : (
            <p className="text-sm text-soDarkGray">No notifications</p>
          )}
          <button
            onClick={markAsRead}
            className="mt-2 text-soBlue hover:underline text-sm"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;