import React, { useState } from 'react';
import { Play, Loader2, CheckCircle } from 'lucide-react';
import apiService from '../../services/api';

const RunAnalysisButton = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleRun = async () => {
    setLoading(true);
    setStatusMsg('Executing ML Pipeline...');
    try {
      const res = await apiService.runAnalysis();
      if (res.success) {
        setStatusMsg('Analysis Complete!');
        if (onComplete) onComplete(res);
      }
    } catch (err) {
      console.error('Run analysis error:', err);
      setStatusMsg('Error executing pipeline');
    } finally {
      setTimeout(() => {
        setLoading(false);
        setStatusMsg('');
      }, 2000);
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      <button
        onClick={handleRun}
        disabled={loading}
        className="btn btn-primary"
        style={{
          backgroundColor: '#2563eb',
          boxShadow: '0 2px 4px rgba(37,99,235,0.2)',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? (
          <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
        ) : (
          <Play style={{ width: '16px', height: '16px', fill: 'currentColor' }} />
        )}
        {loading ? 'Running Analysis...' : 'Run Pipeline Analysis'}
      </button>
      {statusMsg && (
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: statusMsg.includes('Error') ? '#dc2626' : '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          {!statusMsg.includes('Error') && <CheckCircle style={{ width: '14px', height: '14px' }} />}
          {statusMsg}
        </span>
      )}
    </div>
  );
};

export default RunAnalysisButton;
