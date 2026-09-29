import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = '#2563eb', bg = '#eff6ff' }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: '0.25rem 0' }}>
          {value !== undefined && value !== null ? value : '—'}
        </div>
        {subtitle && (
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {subtitle}
          </span>
        )}
      </div>
      {Icon && (
        <div style={{
          padding: '0.6rem',
          borderRadius: '10px',
          backgroundColor: bg,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon style={{ width: '22px', height: '22px' }} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
