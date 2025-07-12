import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AuthForm = ({ setUser, setToken }) => {
  const [isRegister, setIsRegister] = useState(new URLSearchParams(useLocation().search).get('register'));
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegister ? 'register' : 'login';
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, formData);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        setToken(res.data.token);
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded border border-soGray mt-8 shadow-sm">
      <h2 className="text-lg font-bold text-soDarkGray mb-4">{isRegister ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-2 mb-3 border border-soGray rounded text-sm focus:outline-none focus:ring-2 focus:ring-soBlue"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 mb-3 border border-soGray rounded text-sm focus:outline-none focus:ring-2 focus:ring-soBlue"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-2 mb-3 border border-soGray rounded text-sm focus:outline-none focus:ring-2 focus:ring-soBlue"
        />
        <button type="submit" className="btn-so w-full">{isRegister ? 'Sign Up' : 'Log In'}</button>
      </form>
      <button
        onClick={() => setIsRegister(!isRegister)}
        className="mt-3 text-soBlue hover:underline text-sm"
      >
        {isRegister ? 'Log in instead' : 'Sign up instead'}
      </button>
    </div>
  );
};

export default AuthForm;