import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Your pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Journal from './components/journal';
import Rewards from './components/Rewards';
import BuddyPanel from './components/BuddyPanel';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/buddy" element={<BuddyPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
