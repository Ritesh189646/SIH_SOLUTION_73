import React, { useState, useEffect } from 'react';
import { FileText, Download, Layers, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import apiService from '../services/api';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getResults();
      if (res.success) {
        setReportData(res);
      }
    } catch (err) {
      console.error('Fetch report error:', err);
      setError('Unable to fetch report statistics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleExportJSON = () => {
    if (!reportData) return;
    const jsonStr = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SKYGUARD_Telemetry_Report_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  if (loading) return <Loading message="Generating system diagnostic audit report..." />;
  if (error) return <ErrorState message={error} onRetry={fetchReportData} />;

  const stats = reportData?.stats || {};
  const summary = reportData?.summary || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            System Diagnostic & Audit Reports
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
            Exportable summary of AWS multi-sensor pipeline performance and telemetry diagnostics
          </p>
        </div>

        <button onClick={handleExportJSON} className="btn btn-primary">
          <Download style={{ width: '16px', height: '16px' }} />
          Export Report JSON
        </button>
      </div>

      {/* Summary Audit Card */}
      <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          Executive Diagnostic Audit Summary
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Report Timestamp</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>
              {new Date().toLocaleString()}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Evaluated Windows</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563eb', marginTop: '0.25rem' }}>
              {stats.total_scenarios} Test Scenarios
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Total Telemetry Rows</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0284c7', marginTop: '0.25rem' }}>
              {stats.total_records?.toLocaleString()} Rows
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Arbitrated Accuracy</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#16a34a', marginTop: '0.25rem' }}>
              {((stats.arbitrated_accuracy || 0) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Breakdown List */}
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>
          Root Cause Category Breakdown
        </h4>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fault Category</th>
                <th>Scenario Count</th>
                <th>Percentage of Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.fault_distribution || {}).map(([fault, count], idx) => {
                const pct = ((Number(count) / (stats.total_scenarios || 1)) * 100).toFixed(1);
                return (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{fault.toUpperCase()}</td>
                    <td>{count}</td>
                    <td>{pct}%</td>
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

export default Reports;
