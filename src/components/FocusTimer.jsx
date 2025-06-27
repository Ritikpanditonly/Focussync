import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

/**
 * Props
 * ─────
 *  • startMinutes   – initial number of minutes (default 25)
 *  • onCoinsUpdate  – callback(newCoinTotal)  ← lift coin count to parent UI
 */
const FocusTimer = ({ startMinutes = 25, onCoinsUpdate = () => {} }) => {
  /* 1. STATE */
  const [minutes, setMinutes]   = useState(startMinutes);
  const [seconds, setSeconds]   = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [coins, setCoins] = useState(0);            // local display of coins

  const intervalRef = useRef(null);                 // keep the interval ID across renders

  /* 2. EFFECT – timer tick */
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSec) => {
          if (prevSec === 0) {
            setMinutes((prevMin) => {
              if (prevMin === 0) {
                // 5. Timer finished
                clearInterval(intervalRef.current);
                finishSession();                    // async backend + coin update
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
    // Cleanup when paused or unmounted
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  /* 3. Start */
  const handleStart = () => setIsRunning(true);

  /* 4. Reset */
  const handleReset = () => {
    clearInterval(intervalRef.current);
    setMinutes(startMinutes);
    setSeconds(0);
    setIsRunning(false);
  };

  /* 5. After-session backend call */
  const finishSession = async () => {
    try {
      const { data } = await axios.patch('/api/focus/completeSession');
      // Assume backend returns { coins: <new total> }
      setCoins(data.coins);
      onCoinsUpdate(data.coins);
    } catch (err) {
      console.error('Could not complete session:', err);
    } finally {
      setIsRunning(false);
    }
  };

  /* UI */

   return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>⏳ {formatTime(minutes)}:{formatTime(seconds)}</h1>

      {!isRunning ? (
        <button onClick={handleStart}>▶️ Start</button>
      ) : (
        <button onClick={() => setIsRunning(false)}>⏸ Pause</button>
      )}
      <button onClick={handleReset}>🔁 Reset</button>

      <p style={{ fontSize: '18px', marginTop: '10px' }}>💰 Coins: {coins}</p>
    </div>
  );
};

export default FocusTimer;
