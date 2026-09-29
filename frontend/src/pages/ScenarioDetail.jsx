import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, ShieldCheck, Activity, Award } from 'lucide-react';
import apiService from '../services/api';
import MultiSensorTraceChart from '../components/charts/MultiSensorTraceChart';
import DecisionPath from '../components/scenarios/DecisionPath';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import StatusBadge from '../components/common/StatusBadge';

const ScenarioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scenarioData, setScenarioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScenario = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getScenario(id);
      if (res.success) {
        setScenarioData(res.scenario);
      }
    } catch (err) {
      console.error(`Fetch scenario ${id} error:`, err);
      setError(`Unable to load scenario #${id} details from backend.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenario();
  }, [id]);

  if (loading) return <Loading message={`Loading Scenario #${id} 24-hr multi-sensor trace...`} />;
  if (error) return <ErrorState message={error} onRetry={fetchScenario} />;

  const diag = scenarioData?.diagnostics || {};
  const comparison = scenarioData?.architectural_comparison || [];
  const records = scenarioData?.sensor_records || [];
  const conf = Number(diag.root_cause_confidence || diag.confidence || 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back Button & Header */}
      <div>
        <button
          onClick={() => navigate('/scenarios')}
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}
        >
          <ArrowLeft style={{ width: '14px', height: '14px' }} />
          Back to Scenarios Repository
        </button>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Scenario #{id} — Multi-Sensor Trace Analysis
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
              24-hour evaluation window telemetry and dual-channel diagnostic overlay
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Arbitrated Result:</span>
            <StatusBadge status={diag.arbitrated_prediction || 'normal'} />
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Ground Truth Fault</span>
          <div style={{ marginTop: '0.3rem' }}><StatusBadge status={diag.fault_type || 'normal'} /></div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>V2 Classifier Prediction</span>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
            {diag.predicted_fault ? diag.predicted_fault.toUpperCase() : 'NORMAL'}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Classifier Confidence</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb', marginTop: '0.2rem' }}>
            {(conf * 100).toFixed(1)}%
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Point Detector Fired</span>
          <div style={{ marginTop: '0.3rem' }}>
            <StatusBadge status={diag.scenario_detected ? 'ANOMALY DETECTED' : 'CLEAR'} />
          </div>
        </div>
      </div>

      {/* Multi-Sensor Trace Timeline */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity style={{ width: '18px', height: '18px', color: '#2563eb' }} />
          Multi-Sensor Trace Timeline (24 Hours)
        </h3>
        <MultiSensorTraceChart sensorRecords={records} />
      </div>

      {/* Decision Arbitration Visualization */}
      <DecisionPath diagnostics={diag} />

      {/* Architectural Mode Comparison */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
          Architectural Pipeline Mode Comparison for Scenario #{id}
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
          Evaluation comparison across standalone classifier, strict sequential gating, and deployed dual-channel arbitration
        </p>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pipeline Architecture Mode</th>
                <th>Diagnosis Output</th>
                <th>Match True Label ({diag.fault_type ? diag.fault_type.toUpperCase() : ''})</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((comp, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{comp.pipeline_mode}</td>
                  <td><StatusBadge status={comp.diagnosis || 'normal'} /></td>
                  <td>
                    <StatusBadge status={comp.match_true_label ? 'CORRECT' : 'MISCLASSIFIED'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScenarioDetail;
