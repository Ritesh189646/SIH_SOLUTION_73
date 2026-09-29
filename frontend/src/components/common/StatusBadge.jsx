import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const s = String(status || '').toLowerCase();

  if (s === 'normal' || s === 'true' || s === 'correct' || s === 'ok') {
    return (
      <span className="badge badge-normal">
        <CheckCircle2 style={{ width: '12px', height: '12px' }} />
        {status.toString().toUpperCase()}
      </span>
    );
  } else if (s.includes('warn') || s.includes('bias') || s.includes('drift')) {
    return (
      <span className="badge badge-warning">
        <AlertCircle style={{ width: '12px', height: '12px' }} />
        {status.toString().toUpperCase()}
      </span>
    );
  } else {
    return (
      <span className="badge badge-fault">
        <XCircle style={{ width: '12px', height: '12px' }} />
        {status.toString().toUpperCase()}
      </span>
    );
  }
};

export default StatusBadge;
