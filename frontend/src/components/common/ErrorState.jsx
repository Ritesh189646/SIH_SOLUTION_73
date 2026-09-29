import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorState = ({ message = 'Unable to connect to SKYGUARD API backend.', onRetry }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem',
      backgroundColor: '#fef2f2',
      borderRadius: '10px',
      border: '1px solid #fecaca',
      margin: '1rem 0',
      textAlign: 'center'
    }}>
      <AlertTriangle style={{ width: '36px', height: '36px', color: '#dc2626', marginBottom: '0.75rem' }} />
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#991b1b', marginBottom: '0.5rem' }}>
        API Connection Error
      </h3>
      <p style={{ color: '#7f1d1d', fontSize: '0.9rem', maxWidth: '500px', marginBottom: '1.25rem' }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-primary"
          style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }}
        >
          <RefreshCw style={{ width: '16px', height: '16px' }} />
          Retry Connection
        </button>
      )}
    </div>
  );
};

export default ErrorState;
