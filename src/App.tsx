/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Music, Gamepad2, Settings, User, Terminal } from 'lucide-react';
import SnakeGame from './components/SnakeGame.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import { TRACKS } from './constants.ts';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  const currentTrack = TRACKS[currentTrackIndex];
  const accentColor = currentTrack.color;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] font-sans text-white">
      {/* Background Atmosphere */}
      <div 
        className="fixed inset-0 opacity-40 blur-[120px] transition-all duration-1000"
        style={{
          background: `
            radial-gradient(circle at 10% 10%, ${accentColor}33 0%, transparent 40%),
            radial-gradient(circle at 90% 90%, ${accentColor}33 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, #000 0%, transparent 80%)
          `
        }}
      />

      {/* Decorative Grid */}
      <div className="fixed inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Sidebar - Mobile bottom nav, Desktop side rail */}
      <nav className="fixed bottom-0 z-50 flex w-full justify-around border-t border-white/5 bg-black/60 p-4 backdrop-blur-md md:left-0 md:top-0 md:h-full md:w-20 md:flex-col md:justify-center md:gap-8 md:border-r md:border-t-0">
        <NavItem icon={<Music className="h-6 w-6" />} active />
        <NavItem icon={<Gamepad2 className="h-6 w-6" />} />
        <NavItem icon={<Terminal className="h-6 w-6" />} />
        <div className="hidden h-px w-8 bg-white/10 md:block" />
        <NavItem icon={<Settings className="h-6 w-6" />} />
        <NavItem icon={<User className="h-6 w-6" />} />
      </nav>

      {/* Main Content Area */}
      <main className="relative flex min-h-screen flex-col items-center justify-center p-4 pb-24 md:pl-20 md:pb-4 lg:p-12 lg:pl-32">
        <div className="grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1fr_auto]">
          
          {/* Left Column: Player Info & Controls */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
                <span className="font-mono text-xs uppercase tracking-widest text-[#8E9299]">System Online</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl">
                NEON<br />
                <span className="text-transparent" style={{ WebkitTextStroke: '1.5px white', opacity: 0.8 }}>RHYTHM</span>
              </h1>
            </div>

            <MusicPlayer 
              currentTrackIndex={currentTrackIndex} 
              onTrackChange={setCurrentTrackIndex}
              accentColor={accentColor}
            />

            <div className="hidden grid-cols-2 gap-4 lg:grid">
              <StatCard label="PLAYTIME" value="02:45:12" color={accentColor} />
              <StatCard label="HIGH SCORE" value="1,240" color={accentColor} />
            </div>
          </motion.div>

          {/* Right Column: The Game Engine */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <SnakeGame accentColor={accentColor} onScoreUpdate={setScore} />
          </motion.div>
        </div>
      </main>

      {/* Corner Meta Data */}
      <div className="fixed bottom-8 right-8 hidden flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-widest text-[#8E9299] lg:flex">
        <span>Region: Sector 7G</span>
        <span>Version: 3.4.0_rev2</span>
        <span style={{ color: accentColor }}>Sync Status: Perfect</span>
      </div>
    </div>
  );
}

function NavItem({ icon, active = false }: { icon: React.ReactNode; active?: boolean }) {
  return (
    <button className={`group relative p-2 transition-colors ${active ? 'text-white' : 'text-[#8E9299] hover:text-white'}`}>
      {icon}
      {active && (
        <motion.div 
          layoutId="nav-glow"
          className="absolute -inset-1 -z-10 rounded-lg bg-white/5 opacity-50 blur-sm"
        />
      )}
      <div className="absolute -left-2 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-100 md:block hidden" />
    </button>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10">
      <span className="font-mono text-[10px] uppercase tracking-widest text-[#8E9299]">{label}</span>
      <p className="mt-1 font-sans text-xl font-bold tracking-tight" style={{ color: color }}>{value}</p>
    </div>
  );
}
