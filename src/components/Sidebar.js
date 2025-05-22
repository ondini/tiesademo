import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import HistoryIcon from '@mui/icons-material/History';
import DevicesIcon from '@mui/icons-material/Devices';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Sidebar = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        py: 2,
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ px: 2, mb: 2 }}>
          fMRI Suite
        </Typography>
        <List>
          {[
            { text: 'Dashboard', icon: <DashboardIcon />, active: false },
            { text: 'Current recording', icon: <FiberManualRecordIcon />, active: false },
            { text: 'Past recordings', icon: <HistoryIcon />, active: true },
            { text: 'Manage devices', icon: <DevicesIcon />, active: false },
            { text: 'Manage subjects', icon: <PeopleIcon />, active: false }
          ].map(({ text, icon, active }) => (
            <ListItem
              button
              key={text}
              disabled={!active}
              sx={{
                bgcolor: active ? 'primary.light' : 'transparent',
                color: active ? '#071813' : '#aaa',
                '&:hover': {
                  bgcolor: active ? '#00e6b0' : 'transparent'
                }
              }}
            >
              <ListItemIcon sx={{ color: active ? '#071813' : '#666' }}>
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box>
        <Divider sx={{ borderColor: '#444' }} />
        <List>
          {[
            { text: 'Settings', icon: <SettingsIcon /> },
            { text: 'Order consultation', icon: <LocalHospitalIcon /> },
            { text: 'Support', icon: <HelpOutlineIcon /> }
          ].map(({ text, icon }) => (
            <ListItem button key={text} disabled sx={{ color: '#666' }}>
              <ListItemIcon sx={{ color: '#444' }}>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
