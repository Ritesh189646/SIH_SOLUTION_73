import React, { useState, useEffect } from 'react';
import { FileSearch, ShieldCheck, Activity, GitBranch, Layers } from 'lucide-react';
import apiService from '../services/api';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import StatusBadge from '../components/common/StatusBadge';

const Diagnostics = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDiagnostics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getResults();
      if (res.success) {
        setResults(res);
      }
    } catch (err) {
      console.error('Fetch diagnostics error:', err);
      setError('Unable to load combined diagnostics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  if (loading) return <Loading message="Loading telemetry diagnostic analysis..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDiagnostics} />;

  const stats = results?.stats || {};
  const classification = results?.classification || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Diagnostic Pipeline Analysis
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          Comprehensive evaluation of dual-channel point anomaly and XGBoost V2 classification pipeline
        </p>
      </div>

      {/* Diagnostic Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Pipeline Summary Card */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <ShieldCheck style={{ width: '20px', height: '20px', color: '#2563eb' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Pipeline Performance Metrics</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>Total Evaluated Scenarios</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{stats.total_scenarios}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>Total Processed Records</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{stats.total_records?.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>Point Anomalies Detected</span>
              <span style={{ fontWeight: 600, color: '#dc2626' }}>{stats.total_anomalies?.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>Point Detection Fraction</span>
              <span style={{ fontWeight: 600, color: '#d97706' }}>{((stats.anomaly_rate || 0) * 100).toFixed(2)}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Deployed Arbitration Accuracy</span>
              <span style={{ fontWeight: 700, color: '#16a34a' }}>{((stats.arbitrated_accuracy || 0) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Evidence & Sensor Signals Card */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <Activity style={{ width: '20px', height: '20px', color: '#0d9488' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Channel Evidence & Sensor Signals</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>Channel A — Point Anomaly Detector</div>
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                Combines Isolation Forest ensemble scoring with Median Absolute Deviation (MAD) statistical bounds and domain validation rules.
              </p>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>Channel B — XGBoost V2 Classifier</div>
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                Evaluates 504 aggregated statistical, temporal, rolling-window, and derivative features computed per 24-hr scenario window.
              </p>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>Arbitration Gate</div>
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                Bypasses false alarms when classifier confidence ≥ 0.50, confirms anomalies when point detector fires, or suppresses predictions to normal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostics Summary Table */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
          Scenario Diagnostics & Arbitration Log
        </h3>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Scenario ID</th>
                <th>Ground Truth</th>
                <th>Channel B Prediction</th>
                <th>Confidence</th>
                <th>Point Detector Status</th>
                <th>Arbitrated Diagnosis</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(classification.diagnostics_summary || []).slice(0, 15).map((d, idx) => {
                const conf = Number(d.root_cause_confidence || d.confidence || 0);
                return (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>#{d.scenario_id}</td>
                    <td><StatusBadge status={d.fault_type || 'normal'} /></td>
                    <td>{d.predicted_fault ? d.predicted_fault.toUpperCase() : '—'}</td>
                    <td>{(conf * 100).toFixed(1)}%</td>
                    <td>
                      <StatusBadge status={d.scenario_detected ? 'TRIGGERED' : 'CLEAR'} />
                    </td>
                    <td><StatusBadge status={d.arbitrated_prediction || 'normal'} /></td>
                    <td>
                      <StatusBadge status={d.arbitrated_correct ? 'CORRECT' : 'MISCLASSIFIED'} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Diagnostics;
