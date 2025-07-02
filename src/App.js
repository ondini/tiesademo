import React, { useState } from "react";
import { CssBaseline, Box } from "@mui/material";
import RecordingsList from "./components/RecordingsList.js";
import RecordingDetails from "./components/RecordingDetails.js";
import SideMenu from "./components/Sidebar.js";
import AppTheme from './shared-theme/AppTheme.js';

export default function App() {
  const [selectedRecording, setSelectedRecording] = useState(null);

  const handleSelectRecording = (recording) => {
    setSelectedRecording(recording);
  };

  const handleBackToList = () => {
    setSelectedRecording(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppTheme>
        <CssBaseline />
        <SideMenu />
        <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
          {selectedRecording ? (
            <RecordingDetails 
              recording={selectedRecording} 
              onBack={handleBackToList} 
            />
          ) : (
            <RecordingsList onSelectRecording={handleSelectRecording} />
          )}
        </Box>
      </AppTheme>
    </Box>
  );
}