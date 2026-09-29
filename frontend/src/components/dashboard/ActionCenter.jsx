import React from 'react';
import { Wrench, ShieldAlert, FileSpreadsheet, ArrowRight } from 'lucide-react';

const ActionCenter = ({ selectedFault }) => {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
        Stage 4 — Automated Action & Dispatch Matrix
      </h3>
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
        Downstream system dispatch integration based on arbitrated diagnosis
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {/* Field Technician Ticket */}
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706', marginBottom: '0.5rem' }}>
              <Wrench style={{ width: '18px', height: '18px' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Field Technician</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem' }}>
              Dispatches automated maintenance ticket for physical sensor replacement or calibration (Spike / Stuck Sensor).
            </p>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'space-between' }} disabled>
            <span>Create Maintenance Ticket</span>
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </button>
        </div>

        {/* Data Quarantine */}
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', marginBottom: '0.5rem' }}>
              <ShieldAlert style={{ width: '18px', height: '18px' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Analyst Quarantine</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem' }}>
              Flags corrupted data streams (Bias / Drift) to prevent ingestion into downstream NWP weather forecasting models.
            </p>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'space-between' }} disabled>
            <span>Quarantine Data Stream</span>
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </button>
        </div>

        {/* Network Audit CSV */}
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', marginBottom: '0.5rem' }}>
              <FileSpreadsheet style={{ width: '18px', height: '18px' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Admin Network Audit</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem' }}>
              Exports full telemetry diagnostics report and arbitration log for AWS network compliance and SLA auditing.
            </p>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'space-between' }} disabled>
            <span>Generate Network Audit CSV</span>
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionCenter;
