import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = login(username, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        padding: '2.5rem 2rem'
      }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 4px 10px rgba(37,99,235,0.3)'
          }}>
            <Shield style={{ width: '30px', height: '30px' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            SKYGUARD Platform
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
            AWS Multi-Sensor Telemetry Diagnostic Portal
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Operator Username
            </label>
            <div style={{ position: 'relative' }}>
              <UserIcon style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', padding: '0.2rem' }}
              >
                {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', fontWeight: 600, marginTop: '0.5rem' }}
          >
            Authenticate & Launch Dashboard
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
          Demo Access: Username: <strong style={{ color: '#475569' }}>admin</strong> | Password: <strong style={{ color: '#475569' }}>admin123</strong>
        </div>
      </div>
    </div>
  );
};

export default Login;
