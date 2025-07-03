import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { TimerIcon, RotateCcwIcon, PauseIcon, PlayIcon } from 'lucide-react';

const FocusTimer = ({ startMinutes = 25, onCoinsUpdate = () => {} }) => {
  const [minutes, setMinutes] = useState(startMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [coins, setCoins] = useState(0);
  const intervalRef = useRef(null);

  // 🧠 Format MM:SS
  const formatTime = (num) => String(num).padStart(2, '0');

  // 🕒 Handle ticking
  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current) return; // avoid duplicate intervals

      intervalRef.current = setInterval(() => {
        setSeconds((prevSec) => {
          if (prevSec === 0) {
            setMinutes((prevMin) => {
              if (prevMin === 0) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                finishSession(); // 🎯 done!
                return 0;
              }
              return prevMin - 1;
            });
            return 59;
          }
          return prevSec - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning]);

  // ▶️ Start
  const handleStart = () => {
    if (!isRunning) setIsRunning(true);
  };

  // 🔁 Reset
  const handleReset = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setMinutes(startMinutes);
    setSeconds(0);
    setIsRunning(false);
  };

  // ✅ After session complete → backend call
  const finishSession = async () => {
    try {
      const { data } = await axios.patch('/api/focus/completeSession');
      setCoins(data.coins);
      onCoinsUpdate(data.coins);
      toast.success('🎯 Session complete! +1 coin');
    } catch (err) {
      console.error('Could not complete session:', err);
      toast.error('Failed to complete session');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md mx-auto text-center space-y-4">
      <h2 className="text-2xl font-bold flex justify-center items-center gap-2">
        <TimerIcon className="w-6 h-6 text-blue-600" />
        Focus Timer
      </h2>

      <div className="text-5xl font-mono">{formatTime(minutes)}:{formatTime(seconds)}</div>

      <div className="space-x-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl transition text-lg"
          >
            <PlayIcon className="inline w-5 h-5 mr-1" /> Start
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-xl transition text-lg"
          >
            <PauseIcon className="inline w-5 h-5 mr-1" /> Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition text-lg"
        >
          <RotateCcwIcon className="inline w-5 h-5 mr-1" /> Reset
        </button>
      </div>

      <p className="text-lg mt-4">💰 Coins: {coins}</p>
    </div>
  );
};

export default FocusTimer;
