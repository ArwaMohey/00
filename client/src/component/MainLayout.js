import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <div style={{ flex: 1, padding: '0' }}>{children}</div>
  </div>
);

export default MainLayout; 