import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={sidebarOpen} />
        <main style={{
          flex: 1,
          padding: '1.5rem 2rem',
          maxWidth: '1600px',
          width: '100%',
          margin: '0 auto',
          overflowX: 'hidden'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
