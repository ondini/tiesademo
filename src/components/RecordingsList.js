import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  alpha
} from '@mui/material';
import Header from './Header';

const RecordingsList = ({ onSelectRecording }) => {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    // Parse recording folders from public/recordings
    const recordingFolders = [
      'sub-00_ses-00_start-10',
      'sub-01_ses-00_start-10',
      'sub-02_ses-00_start-10', 
      'sub-03_ses-00_start-10',
      'sub-06_ses-00_start-10',
      'sub-07_ses-00_start-10',
    ];

    const recordingsData = recordingFolders.map(folder => {
      const parts = folder.split('_');
      const subjectId = parts[0].replace('sub-', '');
      const sessionId = parts[1].replace('ses-', '');
      
      return {
        id: folder,
        subjectId,
        sessionId,
        folder,
        previewImage: `/recordings/${folder}/fmri_first_frame.png`,
        videoPath: `/recordings/${folder}/fmri_animation.mp4`,
        metricsPath: `/recordings/${folder}/metrics.json`,
        targetsVideoPath: `/recordings/${folder}/targets_animation.mp4`
      };
    });

    setRecordings(recordingsData);
  }, []);

  const handleRecordingClick = (recording) => {
    onSelectRecording(recording);
  };

  return (
    <>
      <Header selectedRecording={null} onNavigateToList={null} />
      <Typography variant="h6" sx={(theme) => ({
        mb: 2,
        color: alpha(theme.palette.primary.main, 1),
      })}>
        Available Simulations
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Select a session to see a demo simulation of the fMRI+FUS feedback loop
      </Typography>

      <Grid container spacing={3}>
        {recordings.map((recording) => (
          <Grid item xs={12} sm={6} md={4} key={recording.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardActionArea onClick={() => handleRecordingClick(recording)}>
                <CardMedia
                  component="img"
                  height="200"
                  image={recording.previewImage}
                  alt={`Subject ${recording.subjectId} Session ${recording.sessionId}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip 
                      label={`Subject ${recording.subjectId}`} 
                      size="small" 
                      color="primary"
                    />
                    <Chip 
                      label={`Session ${recording.sessionId}`} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="h6" component="h3">
                    Session {recording.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    fMRI+FUS feedback simulation demo
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default RecordingsList;
