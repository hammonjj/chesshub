export interface ExternalAccount {
  accountName: string;
  platform: string;
}

export interface UserProfile {
  id: number;
  displayName: string;
}

export const DefaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
export type Pieces = "White" | "Black";

export type Variant = "Bullet" | "Blitz" | "Rapid" | "Classical" | "Correspondence" | "Antichess" | 
  "Atomic" | "Crazyhouse" | "Horde" | "King of the Hill" | "Racing Kings" | "Three-check" | 
  "Chess960" | "Standard" | "From Position";

export type Result = "Win" | "Loss" | "Draw" | "Aborted" | "Stalemate" | "Insufficient material" | 
  "50-move rule" | "Repetition" | "Timeout" | "Checkmate" | "Resignation" | "Time forfeit" | "Disconnection";

export interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  total: number;
}

export interface Game {
  id?: number;
  playedAt: Date;
  url: string;
  timeControl: string;
  variant: Variant;
  userProfile: number;
  pgn: string;
  pieces: Pieces;
  moves: number;
  eco: string;
  result: Result;
  platform: string;
  uuid?: string;
}

export interface StockfishAnalysisResult {
  depth: number;
  score: number; // Centipawns. Positive for white's advantage, negative for black's.
  multipv: number; // Which line this is (1st best move, 2nd best move, etc.)
  pv: string[]; // Principal Variation (best line found) as an array of moves
}

export interface MoveEvaluation {
  score: number;
  multipv: number;
  move: string; //This is the concatenated move list
}