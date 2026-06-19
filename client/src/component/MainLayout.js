import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => (
  <div className="main-layout">
    <Sidebar />
    <main className="main-layout-content">{children}</main>
  </div>
);

export default MainLayout;
