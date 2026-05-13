import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, ListMusic, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types.ts';
import { TRACKS } from '../constants.ts';

interface MusicPlayerProps {
  currentTrackIndex: number;
  onTrackChange: (index: number) => void;
  accentColor: string;
}

export default function MusicPlayer({ currentTrackIndex, onTrackChange, accentColor }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleNext = () => {
    onTrackChange((currentTrackIndex + 1) % TRACKS.length);
  };

  const handlePrevious = () => {
    onTrackChange((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="flex w-full flex-col gap-6 rounded-3xl border border-white/10 bg-[#151619]/80 p-8 backdrop-blur-xl transition-all duration-500 hover:border-white/20">
      <div className="flex items-start gap-6">
        <div className="relative aspect-square w-32 overflow-hidden rounded-2xl shadow-2xl shadow-black/50 sm:w-40 lg:w-48">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 10, opacity: 0, scale: 1.2 }}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="flex flex-1 flex-col pt-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8E9299]">Now Playing</span>
            <ListMusic className="h-4 w-4 cursor-pointer text-[#8E9299] transition-colors hover:text-white" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <h2 className="font-sans text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                {currentTrack.title}
              </h2>
              <p className="font-sans text-base font-medium text-[#8E9299] sm:text-lg">
                {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 hidden items-center gap-4 sm:flex">
            <Volume2 className="h-4 w-4 text-[#8E9299]" />
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/5">
              <div 
                className="h-full transition-all duration-300" 
                style={{ width: '60%', backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/5">
          <motion.div 
            className="absolute left-0 top-0 h-full transition-all duration-100"
            style={{ width: `${progress}%`, backgroundColor: accentColor, boxShadow: `0 0 15px ${accentColor}` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevious}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/5 transition-all hover:bg-white/10"
            >
              <SkipBack className="h-5 w-5 fill-white/10 text-white transition-transform group-hover:scale-110" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: accentColor, boxShadow: `0 0 20px ${accentColor}44` }}
            >
              {isPlaying ? (
                <Pause className="h-7 w-7 fill-white text-white" />
              ) : (
                <Play className="h-7 w-7 fill-white translate-x-0.5 text-white" />
              )}
            </button>
            <button
              onClick={handleNext}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/5 transition-all hover:bg-white/10"
            >
              <SkipForward className="h-5 w-5 fill-white/10 text-white transition-transform group-hover:scale-110" />
            </button>
          </div>

          <div className="font-mono text-[10px] uppercase tracking-widest text-[#8E9299]">
            Hifi Audio • 320kbps
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
    </div>
  );
}
