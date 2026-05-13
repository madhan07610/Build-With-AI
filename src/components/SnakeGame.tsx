import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants.ts';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  accentColor: string;
  onScoreUpdate: (score: number) => void;
}

export default function SnakeGame({ accentColor, onScoreUpdate }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsStarted(true);
    setScore(0);
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isStarted || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = {
          x: (prevSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (prevSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        if (head.x === food.x && head.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            onScoreUpdate(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [isStarted, isGameOver, direction, food, generateFood, onScoreUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const gradient = ctx.createRadialGradient(
        segment.x * cellSize + cellSize / 2,
        segment.y * cellSize + cellSize / 2,
        0,
        segment.x * cellSize + cellSize / 2,
        segment.y * cellSize + cellSize / 2,
        cellSize / 1.5
      );
      gradient.addColorStop(0, accentColor);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = index === 0 ? accentColor : `rgba(${hexToRgb(accentColor)}, ${1 - index / snake.length})`;
      ctx.shadowBlur = 15;
      ctx.shadowColor = accentColor;
      
      // Rounded rectangles for segments
      const r = cellSize * 0.2;
      const x = segment.x * cellSize + 2;
      const y = segment.y * cellSize + 2;
      const w = cellSize - 4;
      const h = cellSize - 4;
      
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

  }, [snake, food, accentColor]);

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '255, 255, 255';
  }

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute -top-12 left-0 right-0 flex justify-between px-4 font-mono text-sm uppercase tracking-widest text-[#8E9299]">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4" style={{ color: accentColor }} />
          <span>Score: <span className="text-white">{score}</span></span>
        </div>
        <div>
          <span>Difficulty: <span className="text-white">Normal</span></span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-black/50">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="max-sm:h-[300px] max-sm:w-[300px]"
        />

        <AnimatePresence>
          {!isStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <h2 className="mb-6 font-sans text-4xl font-bold tracking-tighter text-white">NEON SNAKE</h2>
              <button
                onClick={resetGame}
                className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 transition-all hover:bg-white/10"
              >
                <Play className="h-5 w-5 fill-white" />
                <span className="font-mono text-sm font-medium uppercase tracking-widest text-white">Start Game</span>
              </button>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <h2 className="mb-2 font-sans text-5xl font-bold tracking-tighter text-white">GAME OVER</h2>
              <p className="mb-8 font-mono text-lg text-[#8E9299]">FINAL SCORE: {score}</p>
              <button
                onClick={resetGame}
                className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 transition-all hover:bg-white/10"
              >
                <RefreshCw className="h-5 w-5 transition-transform group-hover:rotate-180" />
                <span className="font-mono text-sm font-medium uppercase tracking-widest text-white">Try Again</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex gap-4">
        <div className="flex flex-col items-center gap-1 opacity-50">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-white/20 text-xs text-white">W</div>
          <span className="font-mono text-[10px] uppercase tracking-tighter text-[#8E9299]">UP</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-50">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-white/20 text-xs text-white">A</div>
          <span className="font-mono text-[10px] uppercase tracking-tighter text-[#8E9299]">LEFT</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-50">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-white/20 text-xs text-white">S</div>
          <span className="font-mono text-[10px] uppercase tracking-tighter text-[#8E9299]">DOWN</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-50">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-white/20 text-xs text-white">D</div>
          <span className="font-mono text-[10px] uppercase tracking-tighter text-[#8E9299]">RIGHT</span>
        </div>
      </div>
    </div>
  );
}
