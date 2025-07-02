import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BuddyPanel = () => {
  const { token } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [buddy, setBuddy] = useState(null);
  const [msg, setMsg] = useState('');

  const axiosAuth = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  // 🔄 Fetch buddy info on load (if already connected)
  useEffect(() => {
    const fetchBuddy = async () => {
      try {
        const res = await axiosAuth.get('/api/buddy/stats');
        setBuddy(res.data);
      } catch (err) {
        // Buddy not connected → no error shown
      }
    };
    fetchBuddy();
  }, []);

  // 📩 Invite buddy by email
  const handleInvite = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const res = await axiosAuth.post('/api/buddy/invite', { email });
      setEmail('');
      setBuddy(res.data.buddy); // Use returned buddy data
      setMsg('Buddy connected successfully!');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to invite buddy');
    }
  };

  // 🛎 Dummy nudge
  const handleNudge = () => {
    alert('👊 Nudge sent! (not implemented)');
  };

  return (
    <div style={{ maxWidth: 400, margin: '20px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>👥 Buddy Panel</h2>

      {msg && <p style={{ color: msg.includes('success') ? 'green' : 'red' }}>{msg}</p>}

      {/* 📧 Invite Form */}
      {!buddy && (
        <form onSubmit={handleInvite} style={{ marginBottom: 20 }}>
          <input
            type="email"
            placeholder="Buddy's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: 8, width: '100%', marginBottom: 10 }}
          />
          <button type="submit" style={{ width: '100%' }}>Invite Buddy</button>
        </form>
      )}

      {/* ✅ Buddy Info */}
      {buddy && (
        <div style={{ background: '#f9f9f9', padding: 15, borderRadius: 6 }}>
          <p>👤 <strong>Name:</strong> {buddy.name}</p>
          <p>🔥 <strong>Streak:</strong> {buddy.streakCount} Days</p>
          <p>💰 <strong>Focus Coins:</strong> {buddy.focusCoins}</p>
          <p>✅ <strong>Status:</strong> Connected</p>
          <button onClick={handleNudge} style={{ marginTop: 10 }}>Send Nudge 👊</button>
        </div>
      )}
    </div>
  );
};

export default BuddyPanel;
