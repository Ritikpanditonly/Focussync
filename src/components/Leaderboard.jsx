import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Leaderboard = () => {
  const { token } = useContext(AuthContext);
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res1 = await axios.get('/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const res2 = await axios.get('/api/buddy/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = [
          {
            name: res1.data.name,
            coins: res1.data.focusCoins,
            streak: res1.data.streakCount
          },
          {
            name: res2.data.name,
            coins: res2.data.focusCoins,
            streak: res2.data.streakCount
          }
        ];

        // Sort by streak (then coins)
        data.sort((a, b) => b.streak - a.streak || b.coins - a.coins);
        setLeaders(data);
      } catch (err) {
        console.log('⚠️ Leaderboard unavailable — maybe no buddy yet.');
      }
    };

    fetchLeaderboard();
  }, [token]);

  if (!leaders.length) return null;

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">🏆 Leaderboard</h2>
      <ul className="text-sm text-gray-600 space-y-1">
        {leaders.map((user, index) => (
          <li key={index} className="flex justify-between">
            <span>{index + 1}. {user.name}</span>
            <span>🔥 {user.streak}d • 💰 {user.coins}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
