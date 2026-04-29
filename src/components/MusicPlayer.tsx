import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'AI Synthwave Alpha', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cybernetic Groove', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Neural Lullaby', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    }
  }, [currentTrackIndex]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  // Using a useCallback or simple function is fine since it's only attached to buttons.
  const handleNext = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const handlePrev = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) audioRef.current.muted = !isMuted;
  };

  return (
    <div className="bg-neutral-900/80 backdrop-blur-md border border-pink-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(236,72,153,0.2)] text-white w-full">
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all"
          style={{ animation: isPlaying ? 'spin 4s linear infinite' : 'none' }}
        >
          <Music className="w-6 h-6 text-white drop-shadow-md" />
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-lg text-pink-400 drop-shadow-[0_0_5px_rgba(236,72,153,0.6)] tracking-wide truncate">
            {TRACKS[currentTrackIndex].title}
          </h3>
          <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">AI Generated Audio</p>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={TRACKS[currentTrackIndex].url}
        title={TRACKS[currentTrackIndex].title}
        crossOrigin="anonymous" /* Recommended for some public audio files */
      />

      <div className="h-1.5 bg-neutral-800 rounded-full mb-6 overflow-hidden border border-neutral-700/50">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-150 ease-linear shadow-[0_0_10px_rgba(236,72,153,0.8)]"
          style={{ width: `${progress || 0}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white">
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={handlePrev} className="p-2 hover:bg-neutral-800 rounded-full transition-colors group">
            <SkipBack className="w-6 h-6 text-pink-400 group-hover:text-pink-300" />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="w-14 h-14 flex items-center justify-center bg-pink-500 hover:bg-pink-400 text-white rounded-full shadow-[0_0_15px_rgba(236,72,153,0.6)] hover:shadow-[0_0_25px_rgba(236,72,153,0.8)] transition-all hover:scale-105"
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </button>
          
          <button onClick={handleNext} className="p-2 hover:bg-neutral-800 rounded-full transition-colors group">
            <SkipForward className="w-6 h-6 text-pink-400 group-hover:text-pink-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
