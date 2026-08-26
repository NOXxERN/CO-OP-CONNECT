import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import StatCard from './StatCard'
import Workers from './Workers'
import Customers from './Customers'
import Bookings from './Bookings'
import Analytics from './Analytics'
import AIPrediction from './AIPrediction'

function Dashboard({
  setIsLoggedIn,
  setEmail,
  setPassword,
}) {
  const [activePage, setActivePage] = useState('dashboard')
const [stats, setStats] = useState({
  total_workers: 0,
  total_customers: 0,
  active_jobs: 0,
  completed_jobs: 0,
})

useEffect(() => {
  fetch('https://coop-connect-backend.onrender.com/api/admin/stats')
    .then((response) => response.json())
    .then((data) => {
      setStats(data)
    })
    .catch((error) => {
      console.error('Error fetching admin stats:', error)
    })
}, [])

  if (activePage === 'workers') {
  return (
    <div className="dashboard">

      <Sidebar setActivePage={setActivePage} />

      <main className="main-content">
        <Workers />
      </main>

    </div>
  )
}

if (activePage === 'customers') {
  return (
    <div className="dashboard">

      <Sidebar setActivePage={setActivePage} />

      <main className="main-content">
        <Customers />
      </main>

    </div>
  )
}

if (activePage === 'bookings') {
  return (
    <div className="dashboard">

      <Sidebar setActivePage={setActivePage} />

      <main className="main-content">
        <Bookings />
      </main>

    </div>
  )
}

if (activePage === 'analytics') {
  return (
    <div className="dashboard">

      <Sidebar setActivePage={setActivePage} />

      <main className="main-content">
        <Analytics />
      </main>

    </div>
  )
}

if (activePage === 'ai') {
  return (
    <div className="dashboard">

      <Sidebar setActivePage={setActivePage} />

      <main className="main-content">
        <AIPrediction />
      </main>

    </div>
  )
}
  return (
    <div className="dashboard">

      <Sidebar setActivePage={setActivePage} />

      <main className="main-content">

        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Admin 👋</p>
          </div>

          <div className="admin-profile">
  <span>👤 Admin</span>

 <button
  className="logout-button"
  onClick={() => {
    localStorage.removeItem('adminToken')
    setEmail('')
    setPassword('')
    setIsLoggedIn(false)
  }}
>
  Logout
</button>
</div>
</header>


        <section className="stats-grid">

          <StatCard
  title="Total Workers"
  value={stats.total_workers}
  icon="👷"
/>
          <StatCard
            title="Customers"
           value={stats.total_customers}
            icon="👥"
          />

          <StatCard
            title="Active Jobs"
            value={stats.active_jobs}
            icon="📋"
          />

          <StatCard
            title="Completed Jobs"
            value={stats.completed_jobs}
            icon="✅"
          />

        </section>


        <section className="dashboard-section">

          <h2>Service Demand</h2>

          <div className="demand-list">

            <p>
              🔧 Plumbing
              <span>██████████ 52</span>
            </p>

            <p>
              ⚡ Electrical
              <span>███████ 38</span>
            </p>

            <p>
              🧹 Cleaning
              <span>█████ 29</span>
            </p>

          </div>

        </section>


        <section className="dashboard-section">

          <h2>AI Demand Prediction</h2>

          <div className="ai-card">

            <h3>🔥 High demand predicted for Plumbing</h3>

            <p>
              AI predicts approximately 52 plumbing requests
              for tomorrow.
            </p>

            <button
  className="ai-prediction-button"
  onClick={() => setActivePage('ai')}
>
  View AI Prediction
</button>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Dashboard