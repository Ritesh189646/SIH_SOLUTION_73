import React from 'react';
import { GitBranch, ShieldCheck, Cpu, ArrowRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const DecisionPath = ({ diagnostics }) => {
  if (!diagnostics) return null;

  const predFault = diagnostics.predicted_fault || 'normal';
  const confidence = Number(diagnostics.root_cause_confidence || diagnostics.confidence || 0);
  const isPointDetected = Boolean(diagnostics.scenario_detected);
  const arbitratedPred = diagnostics.arbitrated_prediction || 'normal';
  const isCorrect = Boolean(diagnostics.arbitrated_correct);
  const trueFault = diagnostics.fault_type || 'unknown';

  // Rule explanation based on confidence and detection
  let ruleReason = '';
  if (confidence >= 0.50) {
    ruleReason = 'High Confidence Bypass (>= 0.50): Classifier prediction directly accepted.';
  } else if (isPointDetected) {
    ruleReason = 'Point Anomaly Confirmed: Point detector fired, validating fault prediction.';
  } else {
    ruleReason = 'Suppressed to Normal: Confidence < 0.50 and no point anomalies detected.';
  }

  return (
    <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
        <GitBranch style={{ width: '20px', height: '20px', color: '#2563eb' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
          Stage 3 — Dual-Channel Decision Arbitration Trace
        </h3>
      </div>

      {/* Visual Workflow Steps */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        {/* Step 1: Channel B Classifier */}
        <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Channel B — Classifier
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            {predFault.toUpperCase()}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, marginTop: '0.2rem' }}>
            Conf: {(confidence * 100).toFixed(1)}%
          </div>
        </div>

        {/* Step 2: Channel A Point Detector */}
        <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Channel A — Point Detector
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: isPointDetected ? '#dc2626' : '#16a34a' }}>
            {isPointDetected ? 'ANOMALY TRIGGERED' : 'NO ANOMALIES'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
            Hits: {diagnostics.detected_rows || 0} / 24 hrs
          </div>
        </div>

        {/* Step 3: Arbitration Gate */}
        <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Decision Arbitrator Gate
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1d4ed8' }}>
            {arbitratedPred.toUpperCase()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#1e3a8a', marginTop: '0.2rem', fontWeight: 500 }}>
            {ruleReason}
          </div>
        </div>

        {/* Step 4: Final Ground Truth Match */}
        <div style={{ padding: '1rem', backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2', borderRadius: '8px', border: `1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}` }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isCorrect ? '#166534' : '#991b1b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Ground Truth Match
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isCorrect ? '#15803d' : '#dc2626', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {isCorrect ? <CheckCircle2 style={{ width: '18px', height: '18px' }} /> : <XCircle style={{ width: '18px', height: '18px' }} />}
            {isCorrect ? 'CORRECT' : 'MISCLASSIFIED'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            True: {trueFault.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionPath;
