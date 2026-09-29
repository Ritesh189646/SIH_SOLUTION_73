import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading diagnostic telemetry data...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      margin: '1rem 0'
    }}>
      <Loader2 style={{ width: '32px', height: '32px', color: '#2563eb', animation: 'spin 1s linear infinite' }} />
      <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
