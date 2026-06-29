import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MatchDetail from './pages/MatchDetail';
import MyPicks from './pages/MyPicks';
import Popular from './pages/Popular';
import EV from './pages/EV';
import Arbitrage from './pages/Arbitrage';
import Middles from './pages/Middles';
import Props from './pages/Props';
import Boosts from './pages/Boosts';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';

function ProtectedLayout() {
  const { user, loading } = useAuth();
  const [activeLeague, setActiveLeague] = useState('mlb');
  const [search, setSearch] = useState('');

  if (loading) return (
    <div className="app-loader">
      <span
        className="material-symbols-outlined"
        style={{ color: 'rgba(255,255,255,0.18)', fontSize: '22px', animation: 'spin 1s linear infinite' }}
      >
        progress_activity
      </span>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  return (
    <WatchlistProvider>
      <div className="app-shell">
        <Sidebar />
        <div className="app-content">
          <TopNav
            activeLeague={activeLeague}
            onLeague={setActiveLeague}
            search={search}
            onSearch={setSearch}
          />
          <main className="app-main">
            <Outlet context={{ activeLeague, search, setSearch }} />
          </main>
        </div>
      </div>
    </WatchlistProvider>
  );
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="games" element={<Dashboard />} />
            <Route path="league/:leagueSlug" element={<Dashboard />} />
            <Route path="match/:id" element={<MatchDetail />} />
            <Route path="picks" element={<MyPicks />} />
            <Route path="popular" element={<Popular />} />
            <Route path="ev" element={<EV />} />
            <Route path="arbitrage" element={<Arbitrage />} />
            <Route path="middle" element={<Middles />} />
            <Route path="props" element={<Props />} />
            <Route path="boosts" element={<Boosts />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
