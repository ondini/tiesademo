import React from "react";
import { CssBaseline, Box, Toolbar, AppBar, Typography, Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dashboard from "./components/Dashboard.js";
import Sidebar from "./components/Sidebar.js";
import SideMenu from "./components/Sidebar2.js";
import AppTheme from './shared-theme/AppTheme.js';
const drawerWidth = 240;
// import { Roboto } from 'next/font/google';
// import { createTheme } from '@mui/material/styles';

// const roboto = Roboto({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// });


// const theme = createTheme({
//   palette: {
//     background: { default: '#ffffff', darker: '#fcfcfc' },
//     primary: { main: '#2c6d7f', light: '#71929c' },
//     secondary: { main: '#00FFC3' },
//     text: { primary: '#071813', secondary: '#6b7280' },
//     mode: 'dark',
//   },
//   typography: {
//     fontFamily: 'Roboto, sans-serif',
//   },
// });

export default function App() {
  return (

    <Box sx={{ display: "flex" }}>
      {/* <ThemeProvider theme={theme}> */}
      <AppTheme>
      <CssBaseline />
      {/* <AppBar position="fixed" sx={{ zIndex: 1201, backgroundColor: "#ffffff", boxShadow: "none", borderBottom: "1px solid #e0e0e0" }}>
        <Toolbar>
          <Box component="img" src="/logo.png" alt="logo" sx={{ height: 40, padding: 0.6 }} />
        </Toolbar>
      </AppBar> */}
      {/* <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", backgroundColor: "#f8f9fb" }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {['Dashboard', 'Order consultation', 'Manage Devices', 'Customer Review'].map((text) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Settings', 'Payment', 'Accounts', 'Help'].map((text) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Sidebar />
      </Drawer> */}
      <SideMenu />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
        {/* <Toolbar /> */}
        <Dashboard />
      </Box>
      </AppTheme>
    </Box>
  );
}