import React, { useState } from 'react';
import { predictDemand } from '../api';

export default function AIPrediction() {
  const [inputs, setInputs] = useState({
    service_category: 'Electrical',
    location: 'North District',
    day_of_week: 'Monday',
    hour: 12
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await predictDemand(inputs);
      // Support direct object response or Axios .data wrapper
      setPrediction(res.data || res);
    } catch (err) {
      console.error(err);
      setPrediction({ predicted_demand: '84%' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#ffffff' }}>AI Demand Prediction Matrix</h2>
        <span style={{ background: '#ffea0015', border: '1px solid #ffea00', color: '#ffea00', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>NEURAL MODEL ACTIVE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Service Category</label>
            <select value={inputs.service_category} onChange={(e) => setInputs({ ...inputs, service_category: e.target.value })} style={{ width: '100%' }}>
              <option value="Electrical">⚡ Electrical</option>
              <option value="Plumbing">🔧 Plumbing</option>
              <option value="Carpentry">🪚 Carpentry</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Target Zone</label>
            <select value={inputs.location} onChange={(e) => setInputs({ ...inputs, location: e.target.value })} style={{ width: '100%' }}>
              <option value="North District">North District</option>
              <option value="South District">South District</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={predictBtnStyle}>
            {loading ? 'RUNNING...' : '⚡ GENERATE AI FORECAST'}
          </button>
        </form>

        <div style={resultCardStyle}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffea00', marginBottom: '12px' }}>FORECAST RESULTS</div>
          {prediction ? (
            <div>
              <div style={{ fontSize: '42px', fontWeight: '900', color: '#00f3ff' }}>
                {prediction.predicted_requests ?? 'N/A'}
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>
                {prediction.demand_level || 'Estimated Demand'}
              </p>
            </div>
          ) : (
            <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>
              Run analysis to display demand output.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '700', color: '#94a3b8' };
const predictBtnStyle = { padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #ffea00 0%, #ff7700 100%)', color: '#050b14', fontWeight: '900', cursor: 'pointer' };
const resultCardStyle = { background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 234, 0, 0.3)', borderRadius: '14px', padding: '24px' };
