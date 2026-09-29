import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Anomalies from './pages/Anomalies';
import Classification from './pages/Classification';
import Scenarios from './pages/Scenarios';
import ScenarioDetail from './pages/ScenarioDetail';
import Diagnostics from './pages/Diagnostics';
import Architecture from './pages/Architecture';
import Reports from './pages/Reports';
import System from './pages/System';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="anomalies" element={<Anomalies />} />
        <Route path="classification" element={<Classification />} />
        <Route path="scenarios" element={<Scenarios />} />
        <Route path="scenarios/:id" element={<ScenarioDetail />} />
        <Route path="diagnostics" element={<Diagnostics />} />
        <Route path="architecture" element={<Architecture />} />
        <Route path="reports" element={<Reports />} />
        <Route path="system" element={<System />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
