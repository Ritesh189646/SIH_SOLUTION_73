import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Search, Filter, ArrowRight } from 'lucide-react';
import apiService from '../services/api';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import StatusBadge from '../components/common/StatusBadge';

const Scenarios = () => {
  const [diagnosticsList, setDiagnosticsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [faultFilter, setFaultFilter] = useState('all');

  const navigate = useNavigate();

  const fetchScenarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const classRes = await apiService.getClassificationResults();
      if (classRes.success && classRes.results?.diagnostics_summary) {
        setDiagnosticsList(classRes.results.diagnostics_summary);
      }
    } catch (err) {
      console.error('Fetch scenarios error:', err);
      setError('Unable to load test scenario list from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  if (loading) return <Loading message="Loading test scenario diagnostic repository..." />;
  if (error) return <ErrorState message={error} onRetry={fetchScenarios} />;

  const filteredScenarios = diagnosticsList.filter((s) => {
    const matchesSearch = !searchTerm ||
      String(s.scenario_id).includes(searchTerm) ||
      (s.fault_type && s.fault_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.arbitrated_prediction && s.arbitrated_prediction.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (faultFilter !== 'all') {
      return matchesSearch && s.fault_type === faultFilter;
    }
    return matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Held-Out Test Scenarios
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          24-hour evaluation scenario windows and diagnostic trace repository
        </p>
      </div>

      {/* Filter Controls */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
            Available Evaluation Windows ({filteredScenarios.length} scenarios)
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '2.25rem', fontSize: '0.8rem' }}
                placeholder="Search scenario ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter style={{ width: '16px', height: '16px', color: '#64748b' }} />
              <select
                className="input-field"
                style={{ fontSize: '0.8rem', width: 'auto' }}
                value={faultFilter}
                onChange={(e) => setFaultFilter(e.target.value)}
              >
                <option value="all">All Fault Types</option>
                <option value="normal">Normal</option>
                <option value="spike">Spike</option>
                <option value="bias">Bias</option>
                <option value="drift">Drift</option>
                <option value="stuck_sensor">Stuck Sensor</option>
                <option value="missing">Missing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scenarios Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Scenario ID</th>
                <th>Ground Truth Fault</th>
                <th>Channel B V2 Prediction</th>
                <th>Classifier Confidence</th>
                <th>Point Detection Status</th>
                <th>Arbitrated Diagnosis</th>
                <th>Arbitration Match</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredScenarios.length > 0 ? (
                filteredScenarios.map((s, idx) => {
                  const conf = Number(s.root_cause_confidence || s.confidence || 0);
                  return (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>#{s.scenario_id}</td>
                      <td><StatusBadge status={s.fault_type || 'normal'} /></td>
                      <td style={{ fontWeight: 500 }}>{s.predicted_fault ? s.predicted_fault.toUpperCase() : '—'}</td>
                      <td>{(conf * 100).toFixed(1)}%</td>
                      <td>
                        <StatusBadge status={s.scenario_detected ? 'TRIGGERED' : 'CLEAR'} />
                      </td>
                      <td><StatusBadge status={s.arbitrated_prediction || 'normal'} /></td>
                      <td>
                        <StatusBadge status={s.arbitrated_correct ? 'CORRECT' : 'MISCLASSIFIED'} />
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/scenarios/${s.scenario_id}`)}
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', gap: '0.25rem' }}
                        >
                          <span>Inspect</span>
                          <ArrowRight style={{ width: '12px', height: '12px' }} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No matching scenarios found.
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

export default Scenarios;
