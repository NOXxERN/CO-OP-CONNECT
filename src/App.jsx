import React, { useEffect, useState } from 'react';
import { BarChart3, Bot, BriefcaseBusiness, Grid2X2, Users, UserRound, Activity } from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import CitizenPortal from './components/CitizenPortal';
import AIPrediction from './components/AIPrediction';
import Workers from './components/Workers';
import MapSearch from './components/MapSearch';
import { fetchStats } from './api';

const velocityData = [
  { day: 'MON', requests: 12 }, { day: 'TUE', requests: 18 },
  { day: 'WED', requests: 15 }, { day: 'THU', requests: 24 },
  { day: 'FRI', requests: 29 }, { day: 'SAT', requests: 22 },
  { day: 'SUN', requests: 31 },
];

const serviceData = [
  { name: 'Electrical', value: 35, color: '#00e5ff' },
  { name: 'Plumbing', value: 25, color: '#ff7900' },
  { name: 'Cleaning', value: 28, color: '#42f59b' },
  { name: 'Carpentry', value: 12, color: '#d7dce2' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
  }, []);

  const nav = [
    ['dashboard', Grid2X2, 'Command Center'],
    ['citizen', Activity, 'Citizen Dispatch'],
    ['workers', UserRound, 'Worker Network'],
    ['bookings', BriefcaseBusiness, 'Bookings'],
    ['customers', Users, 'Customers'],
    ['analytics', BarChart3, 'Analytics'],
    ['prediction', Bot, 'AI Forecast'],
    ['map', Activity, 'Map Match Search'],
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">CC</div>
          <div>
            <strong>CO-OP</strong>
            <h1>CONNECT</h1>
            <small>SMART WORKFORCE GRID</small>
          </div>
        </div>

        <nav className="side-nav">
          {nav.map(([id, Icon, label]) => (
            <button
              key={id}
              className={activeTab === id ? 'side-link active' : 'side-link'}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="system-status">
          <span className="online-dot" />
          <div>Local operations engine active</div>
          <small>Netlify-ready • browser persistence</small>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <div className="eyebrow">SIH · CIVIC CO-OPERATION PLATFORM</div>
            <h2>Command Center</h2>
          </div>
          <div className="top-status">
            <span>● SYSTEM READY</span>
            <span className="network">NETWORK LIVE</span>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <>
            <section className="hero-panel">
              <div>
                <div className="eyebrow">CO-OPERATION STARTS HERE</div>
                <h3>At the right place.</h3>
                <p>One interface for citizen requests, cooperative workers, geospatial dispatch and demand intelligence.</p>
                <div className="hero-actions">
                  <button className="primary-btn" onClick={() => setActiveTab('citizen')}>Create service request →</button>
                  <button className="secondary-btn" onClick={() => setActiveTab('workers')}>Explore worker network</button>
                </div>
              </div>
              <div className="orb">CO-OP<br />GRID</div>
            </section>

            <section className="stat-grid">
              <Stat icon={<UserRound />} label="WORKERS ONLINE" value={stats.total_workers ?? 6} color="cyan" />
              <Stat icon={<Users />} label="REGISTERED USERS" value={stats.total_customers ?? 3} color="orange" />
              <Stat icon={<Activity />} label="ACTIVE JOBS" value={stats.active_jobs ?? 2} color="cyan" />
              <Stat icon={<span>✓</span>} label="COMPLETED JOBS" value={stats.completed_jobs ?? 1} color="orange" />
            </section>

            <section className="chart-grid">
              <div className="panel chart-panel">
                <div className="panel-heading"><div><h3>Request velocity</h3><small>Illustrative operating trend from the current request ledger</small></div><b className="green-badge">● LOCAL MODEL</b></div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={velocityData}>
                    <XAxis dataKey="day" stroke="#607286" />
                    <YAxis stroke="#607286" />
                    <Tooltip contentStyle={{ background: '#09131a', border: '1px solid #00e5ff' }} />
                    <Area type="monotone" dataKey="requests" stroke="#00e5ff" fill="#00e5ff22" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="panel chart-panel">
                <div className="panel-heading"><div><h3>Service mix</h3><small>Current booking distribution</small></div></div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={serviceData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100}>
                      {serviceData.map((item) => <Cell key={item.name} fill={item.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#09131a', border: '1px solid #00e5ff' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="legend">{serviceData.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name}</span>)}</div>
              </div>
            </section>
          </>
        ) : (
          <section className="content-panel">
            {activeTab === 'citizen' && <CitizenPortal />}
            {activeTab === 'workers' && <Workers />}
            {activeTab === 'prediction' && <AIPrediction />}
            {activeTab === 'map' && <MapSearch />}
            {['bookings', 'customers', 'analytics'].includes(activeTab) && (
              <div className="empty-state">This module is ready for connection to the operations ledger.</div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function Stat({ icon, label, value, color }) {
  return <div className="stat-card"><div className={`stat-icon ${color}`}>{icon}</div><div><small>{label}</small><strong>{value}</strong></div></div>;
}
