import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FlameIcon, CoinsIcon, UserIcon } from 'lucide-react';

const DashboardStats = () => {
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);
  const [name, setName]   = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/user/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStreak(res.data.streakCount || 0);
        setCoins(res.data.focusCoins || 0);
        setName(res.data.name || 'User');
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading stats…</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* — Welcome — */}
      <div className="bg-white rounded-2xl p-4 shadow-xl flex items-center gap-4 border-l-4 border-indigo-500">
        <UserIcon className="text-indigo-600" />
        <div>
          <p className="text-sm text-gray-500">Welcome</p>
          <p className="text-xl font-bold text-gray-700">{name}</p>
        </div>
      </div>

      {/* — Streak — */}
      <div className="bg-white rounded-2xl p-4 shadow-xl flex items-center gap-4 border-l-4 border-orange-500">
        <FlameIcon className="text-orange-500" />
        <div>
          <p className="text-sm text-gray-500">Current Streak</p>
          <p className="text-xl font-bold text-gray-700">
            {streak} day{streak !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* — Coins — */}
      <div className="bg-white rounded-2xl p-4 shadow-xl flex items-center gap-4 border-l-4 border-yellow-400">
        <CoinsIcon className="text-yellow-500" />
        <div>
          <p className="text-sm text-gray-500">Focus Coins</p>
          <p className="text-xl font-bold text-gray-700">{coins}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
