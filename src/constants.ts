import { Track } from './types.ts';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Electric Dreams',
    artist: 'AI Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Dummy music
    cover: 'https://picsum.photos/seed/synth1/400/400',
    color: '#ff00ff', // Magenta neon
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'Cyber Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Dummy music
    cover: 'https://picsum.photos/seed/cyber2/400/400',
    color: '#00ffff', // Cyan neon
  },
  {
    id: '3',
    title: 'Midnight Drive',
    artist: 'Retro Runner',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Dummy music
    cover: 'https://picsum.photos/seed/retro3/400/400',
    color: '#39ff14', // Lime neon
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = { x: 0, y: -1 };
export const GAME_SPEED = 100;
