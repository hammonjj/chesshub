export type Pieces = "White" | "Black";
export type Variant = "Bullet" | "Blitz" | "Rapid" | "Classical" | "Correspondence" | "Antichess" | "Atomic" | "Crazyhouse" | "Horde" | "King of the Hill" | "Racing Kings" | "Three-check" | "Chess960" | "Standard" | "From Position";
export type Result = "Win" | "Loss" | "Draw" | "Aborted" | "Stalemate" | "Insufficient material" | "50-move rule" | "Repetition" | "Timeout" | "Checkmate" | "Resignation" | "Time forfeit" | "Disconnection";

export interface Game {
  id: number;
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
}