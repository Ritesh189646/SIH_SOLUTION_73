import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const MultiSensorTraceChart = ({ sensorRecords }) => {
  if (!sensorRecords || sensorRecords.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
        No sensor trace data available for selected scenario window.
      </div>
    );
  }

  // Format timestamp for display
  const formattedData = sensorRecords.map((r) => ({
    ...r,
    timeLabel: r.timestamp ? new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `Hour ${r.hour || 0}`,
    tempVal: r.temp !== undefined && r.temp !== null ? Number(r.temp) : null,
    rhumVal: r.rhum !== undefined && r.rhum !== null ? Number(r.rhum) : null,
    presVal: r.pres !== undefined && r.pres !== null ? Number(r.pres) : null,
    anomalyTrigger: r.is_anomaly ? Number(r.temp) : null
  }));

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Temperature & Humidity Chart */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
          Temperature (°C) & Relative Humidity (%) Trace
        </h4>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="temp" orientation="left" stroke="#e11d48" fontSize={11} domain={['auto', 'auto']} />
              <YAxis yAxisId="rhum" orientation="right" stroke="#0284c7" fontSize={11} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', fontSize: '0.8rem' }}
              />
              <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
              <Line yAxisId="temp" type="monotone" dataKey="tempVal" name="Temperature (°C)" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              <Line yAxisId="rhum" type="monotone" dataKey="rhumVal" name="Relative Humidity (%)" stroke="#0284c7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Surface Pressure Chart */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
          Surface Pressure (hPa) Trace
        </h4>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="pres" orientation="left" stroke="#7c3aed" fontSize={11} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', fontSize: '0.8rem' }}
              />
              <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
              <Line yAxisId="pres" type="monotone" dataKey="presVal" name="Surface Pressure (hPa)" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MultiSensorTraceChart;
