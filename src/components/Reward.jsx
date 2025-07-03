import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GiftIcon, UnlockIcon, LockIcon, CoinsIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Rewards = () => {
  const { token, updateCoins } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [rewards, setRewards] = useState([]);
  const [coins, setCoins] = useState(0);

  const axiosAuth = axios.create({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Fetch rewards & coin count
  const fetchRewards = async () => {
    try {
      const res = await axiosAuth.get('/api/rewards');
      setRewards(res.data.rewards || res.data);
      setCoins(res.data.coins ?? coins);
    } catch (err) {
      toast.error('Failed to fetch rewards');
    }
  };

  useEffect(() => {
    fetchRewards();
    // eslint-disable-next-line
  }, []);

  const handleAddReward = async (e) => {
    e.preventDefault();
    if (!title || !cost) return;

    try {
      await axiosAuth.post('/api/rewards', { title, cost: Number(cost) });
      toast.success('🎁 Reward added');
      setTitle('');
      setCost('');
      fetchRewards();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add reward');
    }
  };

  const handleUnlock = async (id) => {
    try {
      const res = await axiosAuth.patch(`/api/rewards/${id}/unlock`);
      setRewards((prev) =>
        prev.map((r) => (r._id === id ? res.data.reward : r))
      );
      setCoins(res.data.coinsRemaining);
      updateCoins(res.data.coinsRemaining);
      toast.success('✅ Reward unlocked!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Unlock failed');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-xl mx-auto my-6 space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2 text-yellow-600">
        <GiftIcon className="w-6 h-6" />
        Rewards
      </h2>

      <p className="text-lg text-gray-700">
        <CoinsIcon className="inline w-5 h-5 mr-1 text-yellow-400" />
        Coins: <strong>{coins}</strong>
      </p>

      {/* Add Reward Form */}
      <form
        onSubmit={handleAddReward}
        className="flex flex-wrap gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Reward title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <input
          type="number"
          placeholder="Cost"
          value={cost}
          min="1"
          onChange={(e) => setCost(e.target.value)}
          required
          className="w-24 px-3 py-2 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </form>

      {/* List of Rewards */}
      <div className="grid gap-4">
        {rewards.length === 0 ? (
          <p className="text-gray-500">No rewards added yet.</p>
        ) : (
          rewards.map((r) => (
            <div
              key={r._id}
              className="border p-4 rounded-xl shadow-sm flex justify-between items-center bg-gray-50"
            >
              <div>
                <h3 className="text-lg font-semibold">{r.title}</h3>
                <p className="text-sm text-gray-600">
                  Cost: {r.cost} | Status:{' '}
                  {r.unlocked ? (
                    <span className="text-green-600">Unlocked ✅</span>
                  ) : (
                    <span className="text-red-600">Locked 🔒</span>
                  )}
                </p>
              </div>

              {!r.unlocked && coins >= r.cost && (
                <button
                  onClick={() => handleUnlock(r._id)}
                  className="bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition"
                >
                  <UnlockIcon className="inline w-4 h-4 mr-1" />
                  Unlock
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Rewards;
