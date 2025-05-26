import React, { use, useEffect, useRef, useState } from "react";
import { Box, Typography, Grid, LinearProgress, Card, CardContent, IconButton,   Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, 
  Paper,
  CardHeader,
  Divider
} from "@mui/material";
import { PlayArrow, Pause, SkipNext, SkipPrevious, Replay} from "@mui/icons-material";
import Header from './Header';
import Plot from "react-plotly.js";
import { useTheme } from "@mui/material/styles";
import { alpha } from '@mui/material/styles';
import { LineChart } from '@mui/x-charts';

const Dashboard = () => {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  
  const [metrics, setMetrics] = useState(null);
  const [plotData, setPlotData] = useState([]);
  const [brainTargets, setBrainTargets] = useState([]);
  const [pastTargets, setPastTargets] = useState([]);


  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const fps = 10;

  const theme = useTheme();


  useEffect(() => {
    fetch("/metrics.json")
      .then((res) => res.json())
      .then((data) => {
    
        // Create affine combination (weighted average) of the two curves
        const curve1 = data.curves[0];
        const curve2 = data.curves[1];
        
        // Calculate compound metric (60% Network Coherence + 40% DMN Synchrony)
        const compoundY = curve1.y.map((val, i) => (0.6 * val + 0.4 * curve2.y[i]));
        
        // Create new compound curve
        const compoundCurve = {
          x: [...curve1.x], // Use same x values
          y: compoundY,
          type: "scatter",
          mode: "lines+markers",
          name: "Compound metric",
        };
        data = {
          "curves": [...data.curves, compoundCurve],
        }
        setMetrics(data);
        setPlotData(data.curves.map(curve => ({ ...curve, x: [], y: [] })));

      });
    fetch('/targets.json')
      .then(res => res.json())
      .then(data => setBrainTargets(data));
  }, []);

  const syncVideos = () => {
    if (video1Ref.current && video2Ref.current) {
      video2Ref.current.currentTime = video1Ref.current.currentTime;
      setCurrentTime(video1Ref.current.currentTime);
      setProgress((duration > 0 ? ((currentTime) / duration) * 100 : 0))
      if (video1Ref.current.currentTime >= duration) {
        video1Ref.current.pause();
        setPlaying(false);
      }
    }
  };

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

  useEffect(() => {
    const v1 = video1Ref.current;
    if (v1) {
      const onLoaded = () => setDuration(v1.duration);
      v1.addEventListener("loadedmetadata", onLoaded);
      return () => v1.removeEventListener("loadedmetadata", onLoaded);
    }
  }, [video1Ref.current]);
  
  const stepFrame = (step) => {
    const v1 = video1Ref.current;
    // const v2 = video2Ref.current;
    // if (!v1 || !v2) return;
    // assume constant frame rate
    const delta = step * (1 / fps);
    const nextTime = Math.max(0, Math.min(duration, (v1.currentTime + delta)));
    v1.currentTime = nextTime;
    setCurrentTime(nextTime);
    // setProgress((duration > 0 ? ((currentTime+1) / duration) * 100 : 0))
    console.log(progress);
    // v2.currentTime = nextTime;
    // setCurrentTime(nextTime);
  };

  useEffect(() => {
    const frame = Math.round(currentTime * fps);
    const past = brainTargets.filter(bt => frame >= bt.frame);
    setPastTargets(past);
  }, [currentTime, brainTargets]);

  useEffect(() => {
    if (!metrics) return;
    const frame = Math.round(currentTime * fps);
    const idxMax = Math.floor(frame / 3);
    const newCurves = metrics.curves.map(curve => ({
      ...curve,
      x: curve.x.slice(0, idxMax + 1).map(x => parseFloat(x)),
      y: curve.y.slice(0, idxMax + 1)
    }));
    setPlotData(newCurves);
    console.log(newCurves);
  }, [currentTime, metrics]);

  const resetPlayback = () => {
    const v1 = video1Ref.current;
    if (v1) {
      v1.currentTime = 0;
    }
    setCurrentTime(0);
    setProgress(0);
    setPastTargets([]);
    // if (metrics) {
    //   const newCurves = metrics.curves.map(curve => ({
    //     ...curve,
    //     x: [],
    //     y: []
    //   }));
    //   setPlotData(newCurves);
    // }
  };

  return (
    <>
      <Header />
      <Typography variant="h6" sx={(theme) => ({
            mb: 2,
            color: alpha(theme.palette.primary.main, 1),
          })}>
        Subject #21 - Session #3
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        This is a demo of the fMRI+FUS feedback loop. The experiment is run on a real subject dataset and controlled in a simulation environment to reach the high-entropy brain state. 
      </Typography>
      <Card variant="outlined" sx={{ mb: 3, p: 2, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={togglePlay} sx={{ mr: 2 }}>
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton onClick={() => stepFrame(-1)}><SkipPrevious /></IconButton>
        <IconButton onClick={() => stepFrame(1)}><SkipNext /></IconButton>
        <IconButton onClick={() => resetPlayback()} sx={{ ml: 2 }}>
          <Replay />
        </IconButton>
        {/* <Slider
          value={currentTime}
          max={duration}
          onChange={handleSeek}
          sx={{ flex: 1 }}
        /> */}
        <LinearProgress variant={playing ? 'indeterminate' : 'buffer'} color={'background'} sx={{ flex:1, height: 6, borderRadius: 5, backgroundColor: '#e0e0e0' }} />
        <Typography sx={{ ml: 2, mr:2, width: 60, textAlign: 'right' }}>
          {currentTime.toFixed(1)}s
        </Typography>
      </Card>
      
      <Grid container spacing={2}>


        <Grid size={{xs:12, md:5}}>
          <Card variant="outlined">
            <CardHeader title="FUS targeting" />
            <CardContent>
            <Typography variant="body" sx={{ mb: 2 }}> Active target: {brainTargets.length > 0 ? brainTargets[0].name : "None"}</Typography>
              <video
                ref={video2Ref}
                src="/targets_animation.mp4"
                width="100%"
              />
              {/* <Typography variant="body2" sx={{ mt: 2 }}>
                ● Cortical 40% ● Sub-Cortical 32% ● Idle 28%
              </Typography>
              <Typography variant="h6">Brain state progress</Typography>
              <Typography variant="h4" sx={{ mb: 2 }}>89/100</Typography> */}
              <Divider />
              <Box sx={{ mt: 2, mb: 2  }}>
                <Typography variant="body"> Past Targets</Typography>
              </Box>
                <TableContainer component={Paper} sx={{ height: 310, overflow: 'auto' }}>
                  {/* remove shadow */}
                  <Table size="small" stickyHeader >
                    <TableHead>
                        <TableRow>
                          <TableCell>Frame</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Coords</TableCell>
                          <TableCell>Duration</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pastTargets.map((t, i) => (
                          <TableRow key={i}>
                            <TableCell>{t.frame}</TableCell>
                            <TableCell>{t.name}</TableCell>
                            <TableCell>{`[${t.mni_coordinates.join(', ')}]`}</TableCell>
                            <TableCell>{t.duration.toFixed(1)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                  </Table>
                </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid container spacing={2} size={{xs:12, md:7}}>
        <Grid size={12}>
        <Card variant="outlined">
          <CardHeader title="fMRI stream" />
          <CardContent>
            <video
              ref={video1Ref}
              src="/fmri_animation.mp4"
              width="100%"
              onTimeUpdate={syncVideos}
            />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12, md:12}}>
        <Card variant="outlined" sx={{height: 400, display: 'flex', flexDirection: 'column'}}>
          <CardHeader title="Brain activity metrics" />
          <CardContent  sx={{ flex: 1, p: 2 }}>
            {plotData.length > 0 && (
                <Plot
                data={plotData}
                layout={{
                  margin: { t: 20, l: 40, r: 20, b: 40 }, // reduce top padding
                  paper_bgcolor: '#ffffff',
                  plot_bgcolor: '#ffffff',
                  font: { color: '#071813' },
                  colorway: [ '#71a4b5', '#5690a2', '#387c90'],
                }}
                config={{ responsive: true }}
                useResizeHandler
                style={{ width: '100%', height: '100%' }}
              />
            )}

            </CardContent>
            </Card>
        </Grid>
        </Grid>
       
      </Grid>
    </>
  );
};

export default Dashboard;
