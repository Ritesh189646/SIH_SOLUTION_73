import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, Filter, Database, CheckCircle2, Percent } from 'lucide-react';
import apiService from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import StatusBadge from '../components/common/StatusBadge';

const Anomalies = () => {
  const [anomalyData, setAnomalyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchAnomalyResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getAnomalyResults();
      if (res.success) {
        setAnomalyData(res.results);
      }
    } catch (err) {
      console.error('Fetch anomaly results error:', err);
      setError('Unable to load anomaly detection results. Ensure FastAPI server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalyResults();
  }, []);

  if (loading) return <Loading message="Loading Stage 2 — Channel A Point Anomaly Results..." />;
  if (error) return <ErrorState message={error} onRetry={fetchAnomalyResults} />;

  const sampleAnomalies = anomalyData?.sample_anomalies || [];

  const filteredRecords = sampleAnomalies.filter((r) => {
    const matchesSearch = searchTerm === '' ||
      (r.timestamp && r.timestamp.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.scenario_id !== undefined && String(r.scenario_id).includes(searchTerm)) ||
      (r.fault_type && r.fault_type.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === 'anomaly') return matchesSearch && r.is_anomaly;
    if (filterType === 'normal') return matchesSearch && !r.is_anomaly;
    return matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Point Anomaly Detection (Channel A)
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          Isolation Forest + Median Absolute Deviation (MAD) + Domain Rules Execution
        </p>
      </div>

      {/* KPI Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard
          title="Total Processed Rows"
          value={anomalyData?.total_processed_rows?.toLocaleString()}
          subtitle="Hourly sensor observations"
          icon={Database}
          color="#0284c7"
          bg="#e0f2fe"
        />
        <StatCard
          title="Anomalies Triggered"
          value={anomalyData?.anomalies_detected?.toLocaleString()}
          subtitle="Flagged by Channel A"
          icon={AlertTriangle}
          color="#dc2626"
          bg="#fef2f2"
        />
        <StatCard
          title="Normal Records"
          value={anomalyData?.normal_records?.toLocaleString()}
          subtitle="Nominal readings"
          icon={CheckCircle2}
          color="#16a34a"
          bg="#f0fdf4"
        />
        <StatCard
          title="Anomaly Rate"
          value={anomalyData ? `${anomalyData.anomaly_rate_pct}%` : '—'}
          subtitle="Point detection fraction"
          icon={Percent}
          color="#d97706"
          bg="#fffbeb"
        />
      </div>

      {/* Table Section */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
            Triggered Anomaly Sample Log
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '2.25rem', fontSize: '0.8rem' }}
                placeholder="Search timestamp or scenario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter style={{ width: '16px', height: '16px', color: '#64748b' }} />
              <select
                className="input-field"
                style={{ fontSize: '0.8rem', width: 'auto' }}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Records</option>
                <option value="anomaly">Anomalies Only</option>
                <option value="normal">Normal Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Scenario ID</th>
                <th>Timestamp</th>
                <th>Temp (°C)</th>
                <th>RH (%)</th>
                <th>Pres (hPa)</th>
                <th>Ground Fault</th>
                <th>Point Anomaly Flag</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>#{r.scenario_id !== undefined ? r.scenario_id : '—'}</td>
                    <td>{r.timestamp ? new Date(r.timestamp).toLocaleString() : '—'}</td>
                    <td>{r.temp !== undefined ? r.temp : '—'}</td>
                    <td>{r.rhum !== undefined ? r.rhum : '—'}</td>
                    <td>{r.pres !== undefined ? r.pres : '—'}</td>
                    <td><StatusBadge status={r.fault_type || 'normal'} /></td>
                    <td>
                      <StatusBadge status={r.is_anomaly ? 'ANOMALY' : 'NORMAL'} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No matching anomaly records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Anomalies;
