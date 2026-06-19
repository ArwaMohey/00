import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import MonitorIcon from '@mui/icons-material/MonitorHeart';
import { Link, useLocation } from 'react-router-dom';

const menu = [
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Appointments', icon: <EventIcon />, path: '/appointments' },
  { text: 'Doctors', icon: <LocalHospitalIcon />, path: '/doctors' },
  { text: 'Events & News', icon: <NewspaperIcon />, path: '/events-news' },
  { text: 'Monitor', icon: <MonitorIcon />, path: '/monitor' },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {menu.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname.includes(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 