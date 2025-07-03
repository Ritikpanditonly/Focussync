import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  BookOpenIcon,
  WifiIcon,
  WifiOffIcon,
  SaveIcon
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Journal = () => {
  const { token } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('⏳ Loading...');

  const axiosAuth = axios.create({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // 🧠 Fetch today's journal
  useEffect(() => {
    const fetchTodayEntry = async () => {
      try {
        const res = await axiosAuth.get('/api/journal');
        const today = new Date().toDateString();
        const todaysEntry = res.data.find(entry =>
          new Date(entry.date).toDateString() === today
        );
        if (todaysEntry) {
          setContent(todaysEntry.content);
          setStatus('📄 Loaded from server');
        } else {
          setStatus('🆕 No entry for today');
        }
      } catch (err) {
        setStatus('⚠️ Failed to load');
        toast.error('Failed to load journal');
      }
    };
    fetchTodayEntry();
    // eslint-disable-next-line
  }, []);

  // 💾 Save to localStorage every 5s (offline)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!navigator.onLine) {
        localStorage.setItem('journal_draft', content);
        setStatus('💾 Offline — draft saved locally');
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [content]);

  // 🔁 Sync draft when online
  useEffect(() => {
    const syncDraft = async () => {
      const draft = localStorage.getItem('journal_draft');
      if (navigator.onLine && draft) {
        try {
          await axiosAuth.post('/api/journal', { content: draft });
          localStorage.removeItem('journal_draft');
          setStatus('✅ Draft synced to server');
          toast.success('Draft synced!');
        } catch (err) {
          setStatus('⚠️ Sync failed');
          toast.error('Failed to sync draft');
        }
      }
    };
    syncDraft();
    window.addEventListener('online', syncDraft);
    return () => window.removeEventListener('online', syncDraft);
  }, []);

  // 📝 Save immediately on typing if online
  const handleChange = async (e) => {
    const value = e.target.value;
    setContent(value);

    if (navigator.onLine) {
      try {
        await axiosAuth.post('/api/journal', { content: value });
        setStatus('✅ Saved online');
      } catch (err) {
        setStatus('⚠️ Save failed');
        toast.error('Failed to save');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-xl mx-auto my-6 space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2 text-indigo-600">
        <BookOpenIcon className="w-6 h-6" />
        Daily Journal
      </h2>

      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Write your thoughts for today..."
        rows={10}
        className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />

      <div className="flex items-center gap-2 text-sm text-gray-700">
        {navigator.onLine ? (
          <WifiIcon className="w-4 h-4 text-green-600" />
        ) : (
          <WifiOffIcon className="w-4 h-4 text-yellow-500" />
        )}
        <span>{navigator.onLine ? '✅ Online' : '⚠️ Offline — saving locally'}</span>

        <SaveIcon className="w-4 h-4 ml-auto text-gray-400" />
        <span>{status}</span>
      </div>
    </div>
  );
};

export default Journal;
