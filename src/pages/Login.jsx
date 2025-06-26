import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // 2. useState for inputs
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // for redirect

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. handleSubmit → Axios POST to /api/auth/login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', formData);

      // 4. On success → save token + redirect to dashboard
      localStorage.setItem('token', res.data.token);
      setMessage('Login successful!');
      navigate('/dashboard'); // Change to your dashboard route

    } catch (error) {
      setMessage(error.response?.data?.error || 'Login failed');
    }
  };

  // 1. Create form
  return (
    <div>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
