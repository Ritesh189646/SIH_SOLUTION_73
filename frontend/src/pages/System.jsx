import React, { useState, useEffect } from 'react';
import { Server, CheckCircle2, XCircle, RefreshCw, Cpu, Code, Link } from 'lucide-react';
import apiService from '../services/api';

const System = () => {
  const [healthData, setHealthData] = useState(null);
  const [rootData, setRootData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(null);
  const [error, setError] = useState(null);

  const checkSystemStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const h = await apiService.getHealth();
      const r = await apiService.getRoot();
      setHealthData(h);
      setRootData(r);
      setLastCheck(new Date().toLocaleString());
    } catch (err) {
      console.error('System check error:', err);
      setError('Backend API is unreachable at http://127.0.0.1:8000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const endpointsList = [
    { method: 'GET', path: '/', desc: 'Root welcome & service status metadata' },
    { method: 'GET', path: '/health', desc: 'Health check endpoint' },
    { method: 'POST', path: '/analysis/run', desc: 'Executes ML pipeline & updates state' },
    { method: 'POST', path: '/data/upload', desc: 'Accepts CSV telemetry dataset uploads' },
    { method: 'GET', path: '/stats', desc: 'Returns dashboard KPI metrics' },
    { method: 'GET', path: '/anomaly/results', desc: 'Returns Point Anomaly Detection results' },
    { method: 'GET', path: '/classification/results', desc: 'Returns Root Cause Classification results' },
    { method: 'GET', path: '/results', desc: 'Returns combined pipeline summary & results' },
    { method: 'GET', path: '/scenarios', desc: 'Lists available 24-hr test scenario IDs' },
    { method: 'GET', path: '/scenarios/{id}', desc: 'Returns detailed sensor trace & diagnostics for scenario' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            System & FastAPI Service Status
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
            Real-time API connection status, backend URLs, and available endpoints
          </p>
        </div>

        <button onClick={checkSystemStatus} className="btn btn-secondary">
          <RefreshCw style={{ width: '16px', height: '16px' }} />
          Recheck API Status
        </button>
      </div>

      {/* Connection Status Card */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server style={{ width: '20px', height: '20px', color: '#2563eb' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Backend Server Connection</h3>
          </div>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: healthData ? '#16a34a' : '#dc2626',
            backgroundColor: healthData ? '#f0fdf4' : '#fef2f2',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            border: `1px solid ${healthData ? '#bbf7d0' : '#fecaca'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            {healthData ? <CheckCircle2 style={{ width: '14px', height: '14px' }} /> : <XCircle style={{ width: '14px', height: '14px' }} />}
            {healthData ? 'API ONLINE' : 'API OFFLINE'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Backend Server URL</div>
            <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>http://127.0.0.1:8000</div>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Interactive Swagger Docs</div>
            <div style={{ fontWeight: 600, color: '#2563eb', marginTop: '0.2rem' }}>
              <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                http://127.0.0.1:8000/docs
              </a>
            </div>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Last Health Check</div>
            <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>{lastCheck || '—'}</div>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>React Frontend Version</div>
            <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>v2.0.0 (Enterprise Light)</div>
          </div>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
          Configured FastAPI Endpoints Matrix
        </h3>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>HTTP Method</th>
                <th>API Endpoint Route</th>
                <th>Description / Purpose</th>
              </tr>
            </thead>
            <tbody>
              {endpointsList.map((ep, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700, color: ep.method === 'POST' ? '#2563eb' : '#16a34a' }}>
                    {ep.method}
                  </td>
                  <td><code style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem' }}>{ep.path}</code></td>
                  <td style={{ color: '#475569' }}>{ep.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default System;
