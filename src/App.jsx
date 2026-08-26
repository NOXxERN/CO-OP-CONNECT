import React, { useState } from 'react';
import CitizenPortal from './components/CitizenPortal';
import AIPrediction from './components/AIPrediction';
import Workers from './components/Workers';

export default function App() {
  const [activeTab, setActiveTab] = useState('citizen');

  return (
    <div style={{ minHeight: '100vh', padding: '32px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Dynamic Modern Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={logoIconStyle}>GS</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={titleStyle}>CO-OP CONNECT</h1>
              <span style={badgeStyle('#00f3ff')}>V2.4 PRO</span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: '#8892b0', fontSize: '13px', letterSpacing: '0.5px' }}>
              COOPERATIVE WORKFORCE DISPATCH & DEMAND ENGINE
            </p>
          </div>
        </div>

        {/* Floating Status Badges */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={statusPillStyle('#00ff66')}>
            <span style={dotStyle('#00ff66')}></span> FASTAPI: ONLINE
          </div>
          <div style={statusPillStyle('#ffea00')}>
            <span style={dotStyle('#ffea00')}></span> AI ENGINE: ACTIVE
          </div>
        </div>
      </header>

      {/* Styled Navigation Tabs */}
      <nav style={navContainerStyle}>
        <button 
          onClick={() => setActiveTab('citizen')} 
          style={getTabStyle(activeTab === 'citizen', '#00f3ff')}>
          CITIZEN PORTAL
        </button>
        <button 
          onClick={() => setActiveTab('prediction')} 
          style={getTabStyle(activeTab === 'prediction', '#ffea00')}>
          AI DEMAND FORECAST
        </button>
        <button 
          onClick={() => setActiveTab('workers')} 
          style={getTabStyle(activeTab === 'workers', '#ff007f')}>
          WORKER DIRECTORY
        </button>
      </nav>

      {/* Main Glassmorphic Panel */}
      <main style={mainCardStyle}>
        {activeTab === 'citizen' && <CitizenPortal />}
        {activeTab === 'prediction' && <AIPrediction />}
        {activeTab === 'workers' && <Workers />}
      </main>

    </div>
  );
}

// Styling Declarations
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '24px',
  marginBottom: '28px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
};

const logoIconStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #00f3ff 0%, #ff007f 100%)',
  color: '#070d19',
  fontWeight: '900',
  fontSize: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 15px rgba(0, 243, 255, 0.4)'
};

const titleStyle = {
  margin: 0,
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '800',
  letterSpacing: '1px'
};

const badgeStyle = (color) => ({
  background: `${color}18`,
  border: `1px solid ${color}`,
  color: color,
  padding: '2px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: 'bold'
});

const statusPillStyle = (color) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'rgba(15, 23, 42, 0.7)',
  padding: '8px 14px',
  borderRadius: '20px',
  border: `1px solid ${color}66`,
  color: color,
  fontSize: '12px',
  fontWeight: '600'
});

const dotStyle = (color) => ({
  height: '8px',
  width: '8px',
  backgroundColor: color,
  borderRadius: '50%',
  boxShadow: `0 0 8px ${color}`
});

const navContainerStyle = {
  display: 'flex',
  gap: '12px',
  marginBottom: '28px',
  background: 'rgba(15, 23, 42, 0.6)',
  padding: '6px',
  borderRadius: '14px',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};

const getTabStyle = (isActive, neonColor) => ({
  flex: 1,
  background: isActive ? `linear-gradient(180deg, ${neonColor}22 0%, ${neonColor}05 100%)` : 'transparent',
  border: isActive ? `1px solid ${neonColor}` : '1px solid transparent',
  padding: '12px 20px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '0.8px',
  color: isActive ? '#ffffff' : '#64748b',
  borderRadius: '10px',
  transition: 'all 0.25s ease-in-out',
  boxShadow: isActive ? `0 0 15px ${neonColor}33` : 'none'
});

const mainCardStyle = {
  background: 'rgba(13, 25, 48, 0.75)',
  backdropFilter: 'blur(16px)',
  borderRadius: '20px',
  padding: '32px',
  border: '1px solid rgba(0, 243, 255, 0.2)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 243, 255, 0.08)'
};
