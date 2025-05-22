import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Slider,
  Stack,
} from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";
import Plot from "react-plotly.js";

const Dashboard = () => {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const [metrics, setMetrics] = useState(null);

  // Playback state
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load metrics
  useEffect(() => {
    fetch("/metrics.json")
      .then((res) => res.json())
      .then((data) => setMetrics(data));
  }, []);

  // Set duration once metadata is loaded
  useEffect(() => {
    const v1 = video1Ref.current;
    if (v1) {
      const onLoaded = () => setDuration(v1.duration);
      v1.addEventListener("loadedmetadata", onLoaded);
      return () => v1.removeEventListener("loadedmetadata", onLoaded);
    }
  }, [video1Ref.current]);

  // Sync play/pause
  const togglePlay = () => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;
    if (playing) {
      v1.pause();
    //   v2.pause();
    } else {
      v1.play();
    //   v2.play();
    }
    setPlaying(!playing);
  };

  const syncVideos = () => {
    if (video1Ref.current && video2Ref.current) {
      video2Ref.current.currentTime = video1Ref.current.currentTime;
    }
  };

  // Sync time updates
  useEffect(() => {
    let rafId;
    const updateTime = () => {
      const v1 = video1Ref.current;
      if (v1 && !v1.paused) {
        setCurrentTime(v1.currentTime);
        // ensure video2 stays in sync
        if (video2Ref.current) {
          video2Ref.current.currentTime = v1.currentTime;
        }
      }
      rafId = requestAnimationFrame(updateTime);
    };
    if (playing) rafId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(rafId);
  }, [playing]);

  // Seek handler
  const handleSeek = (event, value) => {
    const time = Array.isArray(value) ? value[0] : value;
    if (video1Ref.current && video2Ref.current) {
      video1Ref.current.currentTime = time;
      video2Ref.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      {/* Centralized video controls */}
      <Card variant="outlined" sx={{ mb: 3, p: 2, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={togglePlay} sx={{ mr: 2 }}>
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>
        <Slider
          value={currentTime}
          max={duration}
          onChange={handleSeek}
          sx={{ flex: 1 }}
        />
        <Typography sx={{ ml: 2, width: 60, textAlign: 'right' }}>
          {currentTime.toFixed(1)}s
        </Typography>
      </Card>

      {/* Progress bar for treatment progress */}
      <LinearProgress
        variant="determinate"
        value={64}
        sx={{ height: 6, borderRadius: 5, backgroundColor: '#e0e0e0', mb: 3 }}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="subtitle1">fMRI stream</Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>ID 7.852.000</Typography>
          <video
            ref={video1Ref}
            src="/fmri_animation.mp4"
            width="100%"
            onTimeUpdate={syncVideos}
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1">Selected target</Typography>
          <video
            ref={video2Ref}
            src="/fmri_animation.mp4"
            width="100%"
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            ● Cortical 40% ● Sub-Cortical 32% ● Idle 28%
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Brain state progress</Typography>
              <Typography variant="h4" sx={{ mb: 2 }}>89/100</Typography>
              <Typography variant="subtitle2">Past targets</Typography>
              <ul>
                <li>Prefrontal cortex - 320ms - IDR 45.000</li>
                <li>Prefrontal cortex - 320ms - IDR 45.000</li>
                <li>Prefrontal cortex - 320ms - IDR 45.000</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          {metrics && (
            <Plot
              data={metrics.curves}
              layout={{
                title: "Brain activity in the current run",
                paper_bgcolor: "#ffffff",
                plot_bgcolor: "#ffffff",
                font: { color: "#071813" }
              }}
              config={{ responsive: true }}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
