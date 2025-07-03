import React from 'react';
import DashboardStats from '../components/DashboardStats';
import QuoteBox       from '../components/QuoteBox';
import Leaderboard    from '../components/Leaderboard';
import FocusTimer     from '../components/FocusTimer';
import Rewards        from '../components/Rewards';
import Journal        from '../components/journal';
import BuddyPanel     from '../components/BuddyPanel';

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-6">
      {/* Top widgets */}
      <QuoteBox />
      <DashboardStats />

      {/* Main grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <FocusTimer />
        <BuddyPanel />
        <Rewards />
        <Journal />
        <Leaderboard />
      </div>
    </div>
  );
};

export default Dashboard;
