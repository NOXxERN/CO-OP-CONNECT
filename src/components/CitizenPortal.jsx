import React, { useState } from 'react';
import { createBooking } from '../api';

export default function CitizenPortal() {
  const [formData, setFormData] = useState({
    service_category: 'Electrical',
    location: 'North District',
    urgency: 'Medium',
    details: ''
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createBooking(formData);
      setStatusMsg('Request dispatched successfully to available cooperative workers!');
      setFormData({ service_category: 'Electrical', location: 'North District', urgency: 'Medium', details: '' });
    } catch (err) {
      setStatusMsg('Failed to submit booking request. Please verify backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      
      {/* Title & Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={sectionTitleStyle}>Request Cooperative Worker Service</h2>
        <span style={pillBadgeStyle('#00f3ff')}>FAST DISPATCH</span>
      </div>

      {/* Success / Error Message Banner */}
      {statusMsg && (
        <div style={statusMsg.includes('Failed') ? errorBannerStyle : successBannerStyle}>
          {statusMsg}
        </div>
      )}

      {/* Service Request Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Category & Location Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Service Category</label>
            <select 
              value={formData.service_category} 
              onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
              style={fieldStyle}
            >
              <option value="Electrical">⚡ Electrical</option>
              <option value="Plumbing">🔧 Plumbing</option>
              <option value="Carpentry">🪚 Carpentry</option>
              <option value="Sanitation">🧹 Sanitation & Cleaning</option>
              <option value="Logistics">🚛 Logistics & Transport</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Service Location / Zone</label>
            <select 
              value={formData.location} 
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={fieldStyle}
            >
              <option value="North District">North District</option>
              <option value="South District">South District</option>
              <option value="East Zone">East Zone</option>
              <option value="West Zone">West Zone</option>
              <option value="Central Metro">Central Metro</option>
            </select>
          </div>
        </div>

        {/* Urgency Selection */}
        <div>
          <label style={labelStyle}>Priority Level</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {['Low', 'Medium', 'High'].map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => setFormData({ ...formData, urgency: priority })}
                style={getPriorityButtonStyle(formData.urgency === priority, priority)}
              >
                {priority === 'High' ? '🔥 HIGH' : priority === 'Medium' ? '⚡ MEDIUM' : '🌱 LOW'}
              </button>
            ))}
          </div>
        </div>

        {/* Task Details */}
        <div>
          <label style={labelStyle}>Requirement Details</label>
          <textarea 
            rows="4" 
            placeholder="Describe the issue or assistance required in detail..."
            value={formData.details} 
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            style={{ ...fieldStyle, resize: 'vertical' }}
            required
          />
        </div>

        {/* Dynamic Action Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={submitBtnStyle}
        >
          {isSubmitting ? 'DISPATCHING REQUEST...' : 'SUBMIT SERVICE REQUEST →'}
        </button>

      </form>
    </div>
  );
}

// Visual Styles
const sectionTitleStyle = {
  margin: 0,
  fontSize: '22px',
  fontWeight: '800',
  color: '#ffffff',
  letterSpacing: '0.5px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '12px',
  fontWeight: '700',
  color: '#94a3b8',
  letterSpacing: '1px',
  textTransform: 'uppercase'
};

const fieldStyle = {
  width: '100%',
  boxSizing: 'border-box'
};

const pillBadgeStyle = (color) => ({
  background: `${color}15`,
  border: `1px solid ${color}`,
  color: color,
  padding: '4px 10px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: 'bold',
  letterSpacing: '1px'
});

const successBannerStyle = {
  padding: '14px 18px',
  borderRadius: '12px',
  background: 'rgba(0, 255, 102, 0.1)',
  border: '1px solid #00ff66',
  color: '#00ff66',
  fontSize: '13px',
  fontWeight: 'bold',
  marginBottom: '20px',
  boxShadow: '0 0 15px rgba(0, 255, 102, 0.2)'
};

const errorBannerStyle = {
  padding: '14px 18px',
  borderRadius: '12px',
  background: 'rgba(255, 0, 85, 0.1)',
  border: '1px solid #ff0055',
  color: '#ff0055',
  fontSize: '13px',
  fontWeight: 'bold',
  marginBottom: '20px',
  boxShadow: '0 0 15px rgba(255, 0, 85, 0.2)'
};

const getPriorityButtonStyle = (isSelected, priority) => {
  const colorMap = { Low: '#00ff66', Medium: '#ffea00', High: '#ff007f' };
  const targetColor = colorMap[priority];
  return {
    padding: '12px',
    borderRadius: '10px',
    border: isSelected ? `1px solid ${targetColor}` : '1px solid rgba(255, 255, 255, 0.1)',
    background: isSelected ? `${targetColor}22` : 'rgba(15, 23, 42, 0.6)',
    color: isSelected ? targetColor : '#64748b',
    fontWeight: 'bold',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    boxShadow: isSelected ? `0 0 12px ${targetColor}33` : 'none'
  };
};

const submitBtnStyle = {
  marginTop: '10px',
  padding: '16px',
  borderRadius: '12px',
  border: 'none',
  background: 'linear-gradient(135deg, #00f3ff 0%, #0077ff 100%)',
  color: '#050b14',
  fontWeight: '900',
  fontSize: '14px',
  letterSpacing: '1px',
  cursor: 'pointer',
  boxShadow: '0 0 20px rgba(0, 243, 255, 0.4)',
  transition: 'transform 0.1s ease, box-shadow 0.2s ease'
};
