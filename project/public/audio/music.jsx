// BackgroundMusic.js
import React, { useState, useRef } from 'react';

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <audio ref={audioRef} loop>
        <source src="/audio/background-music.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause Music' : 'Play Music'}
      </button>
    </div>
  );
};

export default BackgroundMusic;
