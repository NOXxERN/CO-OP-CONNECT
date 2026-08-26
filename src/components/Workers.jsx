import React, { useEffect, useState } from 'react';
import { fetchWorkers } from '../api';

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkers()
      .then((data) => {
        // Safe check for raw arrays or Axios wrappers
        const list = Array.isArray(data) ? data : data?.data || [];
        setWorkers(list);
      })
      .catch((err) => {
        console.error('Failed to load workers:', err);
        setWorkers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#ffffff' }}>Cooperative Worker Directory</h2>
        <span style={pillBadgeStyle('#ff007f')}>ACTIVE AGENTS</span>
      </div>

      {loading ? (
        <div style={{ color: '#00f3ff', textAlign: 'center', padding: '40px' }}>FETCHING WORKER NETWORK...</div>
      ) : workers.length === 0 ? (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>No workers currently registered.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {workers.map((worker) => (
            <div key={worker.id || Math.random()} style={workerCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#ffffff', fontWeight: '700' }}>{worker.name || 'Worker'}</h3>
                  <span style={{ fontSize: '12px', color: '#00f3ff' }}>{worker.skill_category || 'General'}</span>
                </div>
                <span style={statusTagStyle(worker.status)}>
                  {worker.status || 'AVAILABLE'}
                </span>
              </div>
              <div style={detailRowStyle}>
                <span>Location:</span>
                <span style={{ color: '#e2e8f0' }}>{worker.location || 'Central Metro'}</span>
              </div>
              <div style={detailRowStyle}>
                <span>Rating:</span>
                <span style={{ color: '#ffea00', fontWeight: 'bold' }}>★ {worker.rating || '4.9'}</span>
              </div>
              <button style={actionButtonStyle}>CONNECT WITH WORKER</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const pillBadgeStyle = (color) => ({
  background: `${color}15`, border: `1px solid ${color}`, color: color, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold'
});

const workerCardStyle = {
  background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(0, 243, 255, 0.2)', borderRadius: '14px', padding: '20px'
};

const statusTagStyle = (status) => ({
  background: status === 'BUSY' ? 'rgba(255, 0, 85, 0.15)' : 'rgba(0, 255, 102, 0.15)',
  border: `1px solid ${status === 'BUSY' ? '#ff0055' : '#00ff66'}`,
  color: status === 'BUSY' ? '#ff0055' : '#00ff66',
  padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold'
});

const detailRowStyle = {
  display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', margin: '6px 0'
};

const actionButtonStyle = {
  width: '100%', marginTop: '14px', padding: '10px', borderRadius: '8px', border: 'none',
  background: 'linear-gradient(135deg, #ff007f 0%, #7928ca 100%)', color: '#ffffff', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer'
};
