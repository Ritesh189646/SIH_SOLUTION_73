import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  AlertTriangle,
  GitBranch,
  FileSearch,
  Cpu,
  FileText,
  Server
} from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Scenario Analysis', path: '/scenarios', icon: Layers },
  { name: 'Anomaly Detection', path: '/anomalies', icon: AlertTriangle },
  { name: 'Fault Classification', path: '/classification', icon: GitBranch },
  { name: 'Diagnostics', path: '/diagnostics', icon: FileSearch },
  { name: 'Architecture', path: '/architecture', icon: Cpu },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'System / API Status', path: '/system', icon: Server },
];

const Sidebar = ({ isOpen }) => {
  return (
    <aside style={{
      width: isOpen ? '240px' : '70px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      minHeight: 'calc(100vh - 64px)',
      transition: 'width 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: '64px',
      height: 'calc(100vh - 64px)',
      zIndex: 30
    }}>
      <div style={{ padding: '1rem 0.5rem', flex: 1, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                margin: '0.25rem 0',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#2563eb' : '#64748b',
                backgroundColor: isActive ? '#eff6ff' : 'transparent',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              })}
            >
              <Icon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </div>

      {isOpen && (
        <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
            SKYGUARD Engine v2.0
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Dual-Channel AWS Diagnostics
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
