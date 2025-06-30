import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardStats = () => {
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. useEffect → fetch user data
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await axios.get('/api/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStreak(res.data.streakCount || 0);
        setCoins(res.data.focusCoins || 0);
      } catch (err) {
        console.error('Failed to fetch user stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (loading) return <p>Loading stats...</p>;

  // 2. Show stats
  return (
    <div style={{ textAlign: 'center', fontSize: '20px', marginTop: '20px' }}>
      <p>🔥 <strong>Current Streak:</strong> {streak} Day{streak !== 1 ? 's' : ''}</p>
      <p>💰 <strong>Focus Coins:</strong> {coins}</p>
    </div>
  );
};

export default DashboardStats;
