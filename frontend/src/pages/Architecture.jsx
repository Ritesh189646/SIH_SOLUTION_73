import React from 'react';
import { Cpu, Layers, GitBranch, ArrowDown, ShieldCheck, Wrench, ShieldAlert, FileSpreadsheet } from 'lucide-react';

const Architecture = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
          SKYGUARD Model Architecture & Pipeline Flow
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          4-Stage Dual-Channel Automated Weather Station (AWS) Telemetry Diagnostic Architecture
        </p>
      </div>

      {/* Stage 1 */}
      <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #2563eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Layers style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase' }}>Stage 1</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Data Ingestion & Leakage-Free Preprocessing</h3>
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
          Raw telemetry streams from Automated Weather Stations (AWS) are windowed into 24-hour scenario blocks (containing Temperature, Relative Humidity, and Surface Pressure). Preprocessing applies leakage-free imputation and temporal alignment.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ArrowDown style={{ width: '24px', height: '24px', color: '#94a3b8' }} />
      </div>

      {/* Stage 2 */}
      <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #7c3aed' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#f3e8ff', color: '#7c3aed' }}>
            <Cpu style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7c3aed', textTransform: 'uppercase' }}>Stage 2</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Dual-Channel ML Execution</h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Channel A */}
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#dc2626', marginBottom: '0.3rem' }}>
              CHANNEL A: Point Anomaly Detector
            </h4>
            <ul style={{ fontSize: '0.8rem', color: '#475569', paddingLeft: '1.25rem', lineHeight: 1.6 }}>
              <li><strong>Isolation Forest</strong> Ensemble Scoring</li>
              <li><strong>MAD (Median Absolute Deviation)</strong> Stat Bounds</li>
              <li>Domain Rules Engine</li>
              <li>Output: Point Anomaly Flag (<code style={{ backgroundColor: '#f1f5f9', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>S_det</code> = True / False)</li>
            </ul>
          </div>

          {/* Channel B */}
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#2563eb', marginBottom: '0.3rem' }}>
              CHANNEL B: Scenario Classifier
            </h4>
            <ul style={{ fontSize: '0.8rem', color: '#475569', paddingLeft: '1.25rem', lineHeight: 1.6 }}>
              <li><strong>504 Aggregated Features</strong> per 24-hr window</li>
              <li><strong>XGBoost V2 (Frozen Model)</strong></li>
              <li>Output: Predicted Fault (<code style={{ backgroundColor: '#f1f5f9', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>y_rc</code>)</li>
              <li>Confidence Score (<code style={{ backgroundColor: '#f1f5f9', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>C_rc</code>)</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ArrowDown style={{ width: '24px', height: '24px', color: '#94a3b8' }} />
      </div>

      {/* Stage 3 */}
      <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #0d9488' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#ccfbf1', color: '#0d9488' }}>
            <GitBranch style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0d9488', textTransform: 'uppercase' }}>Stage 3</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Decision Arbitration Gate</h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '0.85rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>Rule 1 — High Confidence Bypass</div>
            <p style={{ fontSize: '0.78rem', color: '#14532d', marginTop: '0.2rem' }}>
              If Confidence <code style={{ fontWeight: 600 }}>C_rc ≥ 0.50</code> → Accept predicted fault <code style={{ fontWeight: 600 }}>y_rc</code> immediately.
            </p>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e' }}>Rule 2 — Point Confirmation</div>
            <p style={{ fontSize: '0.78rem', color: '#78350f', marginTop: '0.2rem' }}>
              If Confidence <code style={{ fontWeight: 600 }}>C_rc &lt; 0.50</code> AND Point Detector <code style={{ fontWeight: 600 }}>S_det = True</code> → Accept <code style={{ fontWeight: 600 }}>y_rc</code>.
            </p>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991b1b' }}>Rule 3 — False Alarm Suppression</div>
            <p style={{ fontSize: '0.78rem', color: '#7f1d1d', marginTop: '0.2rem' }}>
              If Confidence <code style={{ fontWeight: 600 }}>C_rc &lt; 0.50</code> AND Point Detector <code style={{ fontWeight: 600 }}>S_det = False</code> → Suppress to <code style={{ fontWeight: 600 }}>NORMAL</code>.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ArrowDown style={{ width: '24px', height: '24px', color: '#94a3b8' }} />
      </div>

      {/* Stage 4 */}
      <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #16a34a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <ShieldCheck style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16a34a', textTransform: 'uppercase' }}>Stage 4</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Action / Dispatch / UI Presentation</h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench style={{ width: '16px', height: '16px', color: '#d97706' }} />
            <span>Field Technician Ticket</span>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert style={{ width: '16px', height: '16px', color: '#dc2626' }} />
            <span>Data Stream Quarantine</span>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSpreadsheet style={{ width: '16px', height: '16px', color: '#2563eb' }} />
            <span>Network Audit Log</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Architecture;
