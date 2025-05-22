// components/VideoController.tsx
import { useRef, useState, useEffect } from 'react';
import { Slider, IconButton } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';

export default function VideoController({ videos }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Sync playback
  const togglePlay = () => {
    if (playing) {
      videos.forEach(v => v.pause());
    } else {
      videos.forEach(v => v.play());
    }
    setPlaying(!playing);
  };

  const handleSeek = (value) => {
    videos.forEach(v => v.currentTime = value);
    setCurrentTime(value);
  };

  useEffect(() => {
    if (videos.length > 0 && videos[0].readyState >= 1) {
      setDuration(videos[0].duration);
    }
    const interval = setInterval(() => {
      if (videos.length > 0 && !videos[0].paused) {
        setCurrentTime(videos[0].currentTime);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [videos]);

  return (
    <div className="flex items-center gap-4 p-4 bg-white shadow rounded-xl w-full">
      <IconButton onClick={togglePlay}>
        {playing ? <Pause /> : <PlayArrow />}
      </IconButton>
      <Slider
        value={currentTime}
        max={duration}
        onChange={(_, val) => handleSeek(val)}
        className="flex-1"
      />
      <span className="w-16 text-sm text-gray-700">{currentTime.toFixed(1)}s</span>
    </div>
  );
}
