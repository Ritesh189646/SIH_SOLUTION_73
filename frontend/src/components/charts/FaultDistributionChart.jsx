import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

const FAULT_COLORS = {
  normal: '#16a34a',
  spike: '#dc2626',
  bias: '#d97706',
  drift: '#ea580c',
  stuck_sensor: '#7c3aed',
  missing: '#64748b'
};

const FaultDistributionChart = ({ faultCounts }) => {
  if (!faultCounts || Object.keys(faultCounts).length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
        No classification distribution data available.
      </div>
    );
  }

  const data = Object.entries(faultCounts).map(([fault, count]) => ({
    name: fault.toUpperCase().replace('_', ' '),
    count: Number(count),
    key: fault
  }));

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-15} textAnchor="end" interval={0} />
          <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', fontSize: '0.8rem' }}
          />
          <Bar dataKey="count" name="Evaluated Scenarios" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={FAULT_COLORS[entry.key] || '#2563eb'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FaultDistributionChart;
