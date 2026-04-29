import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RefreshCw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150; // ms per tick

type Point = { x: number; y: number };

const getRandomFoodPosition = (snake: Point[]): Point => {
  let position: Point;
  let isOccupied = true;
  while (isOccupied) {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on the snake body
    isOccupied = snake.some((segment) => segment.x === position.x && segment.y === position.y);
  }
  return position!;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const directionQueue = useRef<Point[]>([]);
  const currentDirRef = useRef<Point>(direction);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    currentDirRef.current = { x: 0, y: -1 };
    directionQueue.current = [];
    setFood(getRandomFoodPosition([{ x: 10, y: 10 }]));
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling with arrows while actively playing
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) && isPlaying) {
        e.preventDefault();
      }

      if (!isPlaying || gameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          resetGame();
        }
        return;
      }

      const lastQueuedDir = directionQueue.current.length > 0 
        ? directionQueue.current[directionQueue.current.length - 1] 
        : currentDirRef.current;

      // Restrict 180 degree turns
      if (e.key === 'ArrowUp' && lastQueuedDir.y !== 1) directionQueue.current.push({ x: 0, y: -1 });
      else if (e.key === 'ArrowDown' && lastQueuedDir.y !== -1) directionQueue.current.push({ x: 0, y: 1 });
      else if (e.key === 'ArrowLeft' && lastQueuedDir.x !== 1) directionQueue.current.push({ x: -1, y: 0 });
      else if (e.key === 'ArrowRight' && lastQueuedDir.x !== -1) directionQueue.current.push({ x: 1, y: 0 });
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      if (directionQueue.current.length > 0) {
        currentDirRef.current = directionQueue.current.shift()!;
        setDirection(currentDirRef.current);
      }

      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + currentDirRef.current.x,
          y: head.y + currentDirRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(getRandomFoodPosition(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    // Calculate game tick speed up to a hard maximum
    const currentSpeed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, currentSpeed);
    
    return () => clearInterval(intervalId);
  }, [isPlaying, gameOver, food, score]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
    }
  }, [gameOver, score, highScore]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header Stats */}
      <div className="w-full max-w-[400px] flex justify-between items-end mb-4 px-1 font-mono">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-cyan-600 font-bold">Score</span>
          <span className="text-2xl leading-none font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-widest text-pink-600 font-bold">High Score</span>
          <div className="flex items-center gap-1 text-pink-400">
            <Trophy className="w-4 h-4 mb-1" />
            <span className="text-xl leading-none font-bold drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Game Board (Responsive square) */}
      <div className="relative w-full aspect-square max-w-[400px] bg-black/60 border-2 border-cyan-500/50 rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.15)] overflow-hidden">
        
        {/* Neon Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(34,211,238,1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,1)_1px,transparent_1px)] bg-[size:5%_5%]" />

        {isPlaying ? (
          <>
            {/* Food item */}
            <div
              className="absolute bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,1)] rounded-full animate-pulse z-10"
              style={{
                left: `${(food.x / GRID_SIZE) * 100}%`,
                top: `${(food.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                transform: 'scale(0.7)',
              }}
            />
            {/* Snake Body */}
            {snake.map((segment, index) => {
              const isHead = index === 0;
              return (
                <div
                  key={`${segment.x}-${segment.y}-${index}`}
                  className={`absolute rounded-sm ${
                    isHead 
                      ? 'bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,1)] z-20' 
                      : 'bg-cyan-600 shadow-[0_0_8px_rgba(8,145,178,0.8)] z-10 opacity-90'
                  }`}
                  style={{
                    left: `${(segment.x / GRID_SIZE) * 100}%`,
                    top: `${(segment.y / GRID_SIZE) * 100}%`,
                    width: `${100 / GRID_SIZE}%`,
                    height: `${100 / GRID_SIZE}%`,
                    transform: isHead ? 'scale(0.95)' : 'scale(0.85)',
                    transition: 'none',
                  }}
                />
              );
            })}
          </>
        ) : null}

        {/* Start Game Overlay */}
        {(!isPlaying && !gameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-30">
             <button 
              onClick={resetGame}
              className="flex flex-col items-center gap-4 text-cyan-400 group"
             >
                <div className="w-16 h-16 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] group-hover:scale-110 bg-cyan-400/10 transition-all duration-300">
                  <Play className="w-8 h-8 ml-1 drop-shadow-[0_0_5px_rgba(34,211,238,1)]" />
                </div>
                <span className="font-bold tracking-[0.2em] shadow-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,1)] group-hover:text-white transition-colors">START SYSTEM</span>
             </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-[2px] z-30">
            <span className="text-4xl md:text-5xl font-black text-pink-500 mb-2 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)] tracking-widest animate-pulse">
              GAME OVER
            </span>
            <span className="text-cyan-400 mb-8 font-mono tracking-widest text-sm md:text-base">FINAL SCORE: [{score}]</span>
            
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-400 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-black transition-all font-bold tracking-[0.1em] shadow-[inset_0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.8)]"
             >
              <RefreshCw className="w-5 h-5" />
              REBOOT
             </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-neutral-400 text-xs text-center max-w-[350px] font-mono leading-relaxed px-4">
         USE <kbd className="bg-neutral-800 text-cyan-300 px-1.5 py-0.5 rounded border border-neutral-700 font-bold mx-1">ARROWS</kbd> TO INTERFACE. <br className="hidden sm:block" /> ENGAGE AUDIO FOR FULL CYBERNETIC IMMERSION.
      </div>
    </div>
  );
}
