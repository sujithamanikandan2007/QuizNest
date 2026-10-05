import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          padding: '2rem 2.5rem',
          overflowY: 'auto',
          maxWidth: '1280px',
        }}
        className="admin-main"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
