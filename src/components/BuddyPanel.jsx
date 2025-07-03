import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  UserPlusIcon,
  MailCheckIcon,
  FlameIcon,
  CoinsIcon,
  HandshakeIcon,
  BellRingIcon
} from 'lucide-react';

const BuddyPanel = () => {
  const { token } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [buddy, setBuddy] = useState(null);
  const [loading, setLoading] = useState(false);

  const axiosAuth = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  // 🔄 Fetch buddy info on mount
  useEffect(() => {
    const fetchBuddy = async () => {
      try {
        const res = await axiosAuth.get('/api/buddy/stats');
        setBuddy(res.data);
      } catch {
        // Buddy not connected → ignore error
      }
    };
    fetchBuddy();
  }, []);

  // 📩 Invite Buddy
  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosAuth.post('/api/buddy/invite', { email });
      setBuddy(res.data.buddy);
      toast.success("✅ Buddy connected successfully!");
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to invite buddy");
    } finally {
      setLoading(false);
    }
  };

  // 🛎 Dummy Nudge
  const handleNudge = () => {
    toast.info("📣 Nudge sent to your buddy!");
  };

  return (
    <div className="bg-white max-w-xl mx-auto mt-8 p-6 rounded-2xl shadow-xl space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2 text-indigo-600">
        <HandshakeIcon className="w-6 h-6" />
        Buddy Panel
      </h2>

      {/* 📧 Invite Form */}
      {!buddy && (
        <form onSubmit={handleInvite} className="space-y-3">
          <input
            type="email"
            value={email}
            placeholder="Enter buddy's email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            <UserPlusIcon className="inline w-4 h-4 mr-2" />
            {loading ? 'Sending Invite...' : 'Invite Buddy'}
          </button>
        </form>
      )}

      {/* ✅ Buddy Info */}
      {buddy && (
        <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-gray-800">
          <div className="flex items-center gap-2">
            <MailCheckIcon className="w-4 h-4 text-green-600" />
            <span><strong>Name:</strong> {buddy.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <FlameIcon className="w-4 h-4 text-orange-500" />
            <span><strong>Streak:</strong> {buddy.streakCount} days</span>
          </div>
          <div className="flex items-center gap-2">
            <CoinsIcon className="w-4 h-4 text-yellow-500" />
            <span><strong>Coins:</strong> {buddy.focusCoins}</span>
          </div>
          <div className="flex items-center gap-2">
            <HandshakeIcon className="w-4 h-4 text-blue-500" />
            <span><strong>Status:</strong> Connected ✅</span>
          </div>

          <button
            onClick={handleNudge}
            className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            <BellRingIcon className="inline w-4 h-4 mr-2" />
            Send Nudge
          </button>
        </div>
      )}
    </div>
  );
};

export default BuddyPanel;
