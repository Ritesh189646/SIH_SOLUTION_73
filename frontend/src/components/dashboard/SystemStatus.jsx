import React from 'react';
import { Server, Cpu, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const SystemStatus = ({ stats, lastRun, apiOnline }) => {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Server style={{ width: '18px', height: '18px', color: '#2563eb' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>System & Pipeline Health</h3>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: apiOnline ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          {apiOnline ? <CheckCircle2 style={{ width: '14px', height: '14px' }} /> : <AlertCircle style={{ width: '14px', height: '14px' }} />}
          {apiOnline ? 'OPERATIONAL' : 'API DISCONNECTED'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Backend Service</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>FastAPI (Uvicorn)</div>
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>ML Pipeline Mode</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>Dual-Channel Arbitrated</div>
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Last Execution</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock style={{ width: '13px', height: '13px', color: '#64748b' }} />
            {lastRun ? new Date(lastRun).toLocaleString() : 'Ready'}
          </div>
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Evaluated Scenarios</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>
            {stats ? `${stats.total_scenarios} Test Windows` : '—'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
