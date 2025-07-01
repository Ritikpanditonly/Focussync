import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Rewards = () => {
  /* --------------------------------------------------------
   * Context: grab token + coin updater so we can sync UI
   * ------------------------------------------------------ */
  const { token, updateCoins, user } = useContext(AuthContext);

  /* --------------------------------------------------------
   * Local state
   * ------------------------------------------------------ */
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [rewards, setRewards] = useState([]);
  const [msg, setMsg] = useState('');

  /* --------------------------------------------------------
   * Reusable Axios instance with auth header
   * ------------------------------------------------------ */
  const axiosAuth = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  /* --------------------------------------------------------
   * 1️⃣ Fetch all rewards on mount
   * ------------------------------------------------------ */
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await axiosAuth.get('/api/rewards');
        setRewards(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --------------------------------------------------------
   * Add new reward
   * ------------------------------------------------------ */
  const handleAddReward = async (e) => {
    e.preventDefault();
    if (!title || !cost) return;

    try {
      const res = await axiosAuth.post('/api/rewards', {
        title,
        cost: Number(cost)
      });
      setRewards((prev) => [...prev, res.data.reward]);
      setTitle('');
      setCost('');
      setMsg('');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error adding reward');
    }
  };

  /* --------------------------------------------------------
   * Unlock reward
   * ------------------------------------------------------ */
  const handleUnlock = async (id) => {
    try {
      const res = await axiosAuth.patch(`/api/rewards/${id}/unlock`);
      // Update local list
      setRewards((prev) =>
        prev.map((r) => (r._id === id ? res.data.reward : r))
      );
      // Update global coin count
      updateCoins(res.data.coinsRemaining);
      setMsg('');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error unlocking reward');
    }
  };

  /* --------------------------------------------------------
   * Render
   * ------------------------------------------------------ */
  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>Rewards</h2>

      {msg && <p style={{ color: 'red' }}>{msg}</p>}

      {/* ───── Form to add reward ───── */}
      <form onSubmit={handleAddReward} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Reward title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Cost"
          value={cost}
          min="1"
          onChange={(e) => setCost(e.target.value)}
          required
        />
        <button type="submit">Add Reward</button>
      </form>

      {/* ───── List of rewards ───── */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {rewards.map((r) => (
          <li
            key={r._id}
            style={{
              marginBottom: 10,
              padding: 10,
              border: '1px solid #ddd',
              borderRadius: 6
            }}
          >
            <strong>{r.title}</strong> — {r.cost} coins —{' '}
            {r.unlocked ? 'Unlocked ✅' : 'Locked 🔒'}
            {!r.unlocked && user?.focusCoins >= r.cost && (
              <button
                onClick={() => handleUnlock(r._id)}
                style={{ marginLeft: 10 }}
              >
                Unlock
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rewards;
