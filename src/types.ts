export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  color: string;
}

export interface GameState {
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}
