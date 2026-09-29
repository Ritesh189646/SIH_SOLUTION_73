import React, { useState, useEffect } from 'react';
import { Shield, Bell, User, LogOut, CheckCircle2, XCircle, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const checkApi = async () => {
      try {
        await apiService.getHealth();
        if (isMounted) setApiOnline(true);
      } catch (err) {
        if (isMounted) setApiOnline(false);
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    }}>
      {/* Left Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          style={{ padding: '0.4rem', borderRadius: '6px', color: '#64748b' }}
          className="btn-secondary"
          title="Toggle Navigation"
        >
          <Menu style={{ width: '20px', height: '20px' }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 4px rgba(37,99,235,0.3)'
          }}>
            <Shield style={{ width: '22px', height: '22px' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
              SKYGUARD
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
              Multi-Sensor Fault Detection Platform
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Backend Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.78rem',
          fontWeight: 600,
          backgroundColor: apiOnline ? '#f0fdf4' : '#fef2f2',
          color: apiOnline ? '#16a34a' : '#dc2626',
          border: `1px solid ${apiOnline ? '#bbf7d0' : '#fecaca'}`
        }}>
          {apiOnline === null ? (
            <span style={{ color: '#94a3b8' }}>Checking API...</span>
          ) : apiOnline ? (
            <>
              <CheckCircle2 style={{ width: '13px', height: '13px' }} />
              API ONLINE
            </>
          ) : (
            <>
              <XCircle style={{ width: '13px', height: '13px' }} />
              API OFFLINE
            </>
          )}
        </div>

        {/* User Profile */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '0.75rem', borderLeft: '1px solid #e2e8f0' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}>
              <User style={{ width: '18px', height: '18px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{user.name}</span>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{user.role}</span>
            </div>
            <button
              onClick={logout}
              title="Logout"
              style={{
                marginLeft: '0.5rem',
                padding: '0.4rem',
                borderRadius: '6px',
                color: '#94a3b8',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
            >
              <LogOut style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
