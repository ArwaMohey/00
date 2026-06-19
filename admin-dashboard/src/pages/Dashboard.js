import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material';

const Dashboard = () => (
  <Box sx={{ display: 'flex' }}>
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Outlet />
    </Box>
  </Box>
);

export default Dashboard; 