import React, { useState, useEffect } from 'react';
import { GitBranch, Award, Layers, Search } from 'lucide-react';
import apiService from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import FaultDistributionChart from '../components/charts/FaultDistributionChart';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import StatusBadge from '../components/common/StatusBadge';

const Classification = () => {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClassificationResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getClassificationResults();
      if (res.success) {
        setClassData(res.results);
      }
    } catch (err) {
      console.error('Fetch classification error:', err);
      setError('Unable to load classification results from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassificationResults();
  }, []);

  if (loading) return <Loading message="Loading Stage 2 — Channel B XGBoost V2 Classifier Diagnostics..." />;
  if (error) return <ErrorState message={error} onRetry={fetchClassificationResults} />;

  const diagnosticsSummary = classData?.diagnostics_summary || [];

  const filteredDiagnostics = diagnosticsSummary.filter((d) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (d.scenario_id !== undefined && String(d.scenario_id).includes(term)) ||
      (d.fault_type && d.fault_type.toLowerCase().includes(term)) ||
      (d.predicted_fault && d.predicted_fault.toLowerCase().includes(term)) ||
      (d.arbitrated_prediction && d.arbitrated_prediction.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Scenario Fault Classification (Channel B & Arbitration)
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          504 Aggregated Features + XGBoost V2 Model Execution with Decision Arbitration
        </p>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard
          title="Scenarios Evaluated"
          value={classData?.scenarios_evaluated}
          subtitle="24-hr multi-sensor windows"
          icon={Layers}
          color="#2563eb"
          bg="#eff6ff"
        />
        <StatCard
          title="Classification Accuracy"
          value={classData ? `${(classData.overall_accuracy * 100).toFixed(1)}%` : '—'}
          subtitle="Overall arbitrated accuracy"
          icon={Award}
          color="#7c3aed"
          bg="#f3e8ff"
        />
      </div>

      {/* Fault Distribution Chart */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
          Root Cause Fault Category Breakdown
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
          Evaluated test scenarios grouped by root cause category
        </p>
        <FaultDistributionChart faultCounts={classData?.fault_counts} />
      </div>

      {/* Diagnostics Table */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
            Diagnostic & Arbitration Summary Log
          </h3>

          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '2.25rem', fontSize: '0.8rem' }}
              placeholder="Filter by fault type or scenario ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Scenario ID</th>
                <th>Ground Truth Fault</th>
                <th>Channel B V2 Prediction</th>
                <th>Classifier Confidence</th>
                <th>Point Detector Triggered</th>
                <th>Arbitrated Diagnosis</th>
                <th>Match Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredDiagnostics.length > 0 ? (
                filteredDiagnostics.map((d, idx) => {
                  const conf = Number(d.root_cause_confidence || d.confidence || 0);
                  return (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>#{d.scenario_id}</td>
                      <td><StatusBadge status={d.fault_type || 'normal'} /></td>
                      <td style={{ fontWeight: 500 }}>{d.predicted_fault ? d.predicted_fault.toUpperCase() : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(conf * 100, 100)}%`, backgroundColor: '#2563eb' }} />
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e40af', width: '45px' }}>
                            {(conf * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={d.scenario_detected ? 'TRIGGERED' : 'CLEAR'} />
                      </td>
                      <td><StatusBadge status={d.arbitrated_prediction || 'normal'} /></td>
                      <td>
                        <StatusBadge status={d.arbitrated_correct ? 'CORRECT' : 'MISCLASSIFIED'} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No matching diagnostic records found.
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

export default Classification;
