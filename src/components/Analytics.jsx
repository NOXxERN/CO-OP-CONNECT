import { useEffect, useState } from 'react'

function Analytics() {
  const [stats, setStats] = useState({
    total_workers: 0,
    total_customers: 0,
    active_jobs: 0,
    completed_jobs: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('https://coop-connect-backend.onrender.com/api/admin/stats')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch analytics')
        }

        return response.json()
      })
      .then((data) => {
        setStats(data)
      })
      .catch((error) => {
        console.error('Analytics error:', error)
        setError('Unable to load analytics.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Service Analytics</h1>
          <p>Monitor platform activity and performance.</p>
        </div>
      </div>

      {loading && (
        <p>Loading analytics...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!loading && !error && (
        <>
          <div className="analytics-cards">

            <div className="analytics-card">
              <span>Total Workers</span>
              <strong>{stats.total_workers}</strong>
              <small>Currently registered</small>
            </div>

            <div className="analytics-card">
              <span>Total Customers</span>
              <strong>{stats.total_customers}</strong>
              <small>Currently registered</small>
            </div>

            <div className="analytics-card">
              <span>Active Jobs</span>
              <strong>{stats.active_jobs}</strong>
              <small>Currently running</small>
            </div>

            <div className="analytics-card">
              <span>Completed Jobs</span>
              <strong>{stats.completed_jobs}</strong>
              <small>Successfully completed</small>
            </div>

          </div>

          <div className="analytics-section">

            <h2>Platform Overview</h2>

            <div className="service-list">

              <div className="service-row">
                <div className="service-info">
                  <strong>Workers</strong>
                  <span>{stats.total_workers} registered</span>
                </div>

                <div className="bar-container">
                  <div
                    className="bar"
                    style={{
                      width: `${Math.min(
                        stats.total_workers * 10,
                        100
                      )}%`,
                      backgroundColor: '#0f766e',
                    }}
                  ></div>
                </div>
              </div>

              <div className="service-row">
                <div className="service-info">
                  <strong>Active Jobs</strong>
                  <span>{stats.active_jobs} currently active</span>
                </div>

                <div className="bar-container">
                  <div
                    className="bar"
                    style={{
                      width: `${Math.min(
                        stats.active_jobs * 10,
                        100
                      )}%`,
                      backgroundColor: '#2563eb',
                    }}
                  ></div>
                </div>
              </div>

              <div className="service-row">
                <div className="service-info">
                  <strong>Completed Jobs</strong>
                  <span>{stats.completed_jobs} completed</span>
                </div>

                <div className="bar-container">
                  <div
                    className="bar"
                    style={{
                      width: `${Math.min(
                        stats.completed_jobs,
                        100
                      )}%`,
                      backgroundColor: '#7c3aed',
                    }}
                  ></div>
                </div>
              </div>

            </div>

          </div>
        </>
      )}

    </div>
  )
}

export default Analytics