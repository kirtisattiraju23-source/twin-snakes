/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 md:p-8 font-sans overflow-x-hidden relative">
      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-900/10 blur-[100px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-5xl flex flex-col items-center">
        {/* Main Title Section */}
        <header className="mb-8 md:mb-12 text-center w-full">
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
            NEON BEATS SURVIVAL
          </h1>
          <p className="text-neutral-400 mt-2 font-mono text-sm uppercase tracking-[0.3em]">
            Algorithmic Audio Integration
          </p>
        </header>

        {/* Layout Grid */}
        <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 items-center xl:items-start justify-center w-full">
            
          {/* Centered Game */}
          <div className="w-full max-w-[450px] bg-black/40 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] order-1 xl:order-none">
            <SnakeGame />
          </div>

          {/* Music Player Side Panel */}
          <div className="w-full max-w-[450px] xl:max-w-sm flex-shrink-0 order-2 xl:order-none xl:mt-8">
            <MusicPlayer />
          </div>
          
        </div>
      </div>
    </div>
  );
}
