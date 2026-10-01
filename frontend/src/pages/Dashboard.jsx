import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Database,
  AlertTriangle,
  CheckCircle2,
  Percent,
  Award,
  ArrowRight
} from 'lucide-react';
import apiService from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import SystemStatus from '../components/dashboard/SystemStatus';
import ActionCenter from '../components/dashboard/ActionCenter';
import FaultDistributionChart from '../components/charts/FaultDistributionChart';
import RunAnalysisButton from '../components/common/RunAnalysisButton';
import FileUploader from '../components/common/FileUploader';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import StatusBadge from '../components/common/StatusBadge';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRun, setLastRun] = useState(null);
  const [apiOnline, setApiOnline] = useState(true);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsRes = await apiService.getStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      const scenariosRes = await apiService.getScenarios();
      if (scenariosRes.success) {
        setScenarios(scenariosRes.scenarios.slice(0, 8)); // top 8 scenarios
      }

      setLastRun(new Date().toISOString());
      setApiOnline(true);
    } catch (err) {
      console.error('Fetch dashboard error:', err);
      setError('Unable to load telemetry stats from backend. Please ensure the API server is running.');
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading message="Initializing SKYGUARD Telemetry Diagnostic Engine..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDashboardData} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            SKYGUARD Overview
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
            AI-powered multi-sensor fault detection and diagnostic monitoring platform
          </p>
        </div>
        <RunAnalysisButton onComplete={fetchDashboardData} />
      </div>

      {/* Top Real KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        <StatCard
          title="Total Scenarios"
          value={stats?.total_scenarios}
          subtitle="Held-out 24-hr test windows"
          icon={Layers}
          color="#2563eb"
          bg="#eff6ff"
        />
        <StatCard
          title="Total Records"
          value={stats?.total_records?.toLocaleString()}
          subtitle="Processed hourly rows"
          icon={Database}
          color="#0284c7"
          bg="#e0f2fe"
        />
        <StatCard
          title="Point Anomalies"
          value={stats?.total_anomalies?.toLocaleString()}
          subtitle="Triggered point anomalies"
          icon={AlertTriangle}
          color="#dc2626"
          bg="#fef2f2"
        />
        <StatCard
          title="Normal Records"
          value={stats?.normal_records?.toLocaleString()}
          subtitle="Safe telemetry observations"
          icon={CheckCircle2}
          color="#16a34a"
          bg="#f0fdf4"
        />
        <StatCard
          title="Anomaly Rate"
          value={stats ? `${(stats.anomaly_rate * 100).toFixed(1)}%` : '—'}
          subtitle="Point detection fraction"
          icon={Percent}
          color="#d97706"
          bg="#fffbeb"
        />
        <StatCard
          title="Arbitrated Accuracy"
          value={stats ? `${(stats.arbitrated_accuracy * 100).toFixed(1)}%` : '—'}
          subtitle="Deployed pipeline accuracy"
          icon={Award}
          color="#7c3aed"
          bg="#f3e8ff"
        />
      </div>

      {/* Grid Row: System Status & File Upload */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        <SystemStatus stats={stats} lastRun={lastRun} apiOnline={apiOnline} />
        <FileUploader onUploadSuccess={fetchDashboardData} />
      </div>

      {/* Grid Row: Fault Distribution Chart & Recent Scenarios Table */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
            Fault Classification Distribution
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
            Evaluated test scenarios grouped by root cause category
          </p>
          <FaultDistributionChart faultCounts={stats?.fault_distribution} />
        </div>

        {/* Quick Scenario List */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Recent Test Scenarios</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Select scenario to inspect 24-hr multi-sensor trace</p>
            </div>
            <button onClick={() => navigate('/scenarios')} className="btn btn-secondary" style={{ fontSize: '0.8rem', gap: '0.3rem' }}>
              <span>View All</span>
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {scenarios.map((sid) => (
              <div
                key={sid}
                onClick={() => navigate(`/scenarios/${sid}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Scenario #{sid}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 500 }}>Inspect Trace →</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Downstream Action Matrix */}
      <ActionCenter />
    </div>
  );
};

export default Dashboard;
