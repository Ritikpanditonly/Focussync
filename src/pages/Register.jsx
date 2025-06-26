import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  // 2. useState for inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. handleSubmit → Axios POST to /api/auth/register
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', formData);
      
      // 4. On success → save token in localStorage
      localStorage.setItem('token', res.data.token);
      setMessage('Registration successful!');

      // Optionally clear form
      setFormData({ name: '', email: '', password: '' });

    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong');
    }
  };

  // 1. Create form
  return (
    <div>
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        /><br />

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

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
