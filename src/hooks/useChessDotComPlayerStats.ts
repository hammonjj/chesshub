import { useQuery } from '@tanstack/react-query';
import { convertKeysToUpperCamelCase } from '../utils/utils';

interface ChessPerformance {
  rating: number;
  date: number;
  rd?: number;
  game?: string;
}

interface ChessRecord {
  win: number;
  loss: number;
  draw: number;
}

interface ChessVariantStats {
  last: ChessPerformance;
  best: ChessPerformance;
  record: ChessRecord;
}

interface TacticsStats {
  highest: ChessPerformance;
  lowest: ChessPerformance;
}

interface PuzzleRushStats {
  best: {
    totalAttempts: number;
    score: number;
  };
}

interface PlayerStats {
  chessRapid: ChessVariantStats;
  chessBlitz: ChessVariantStats;
  fide: number;
  tactics: TacticsStats;
  puzzleRush: PuzzleRushStats;
}

interface PlayerStatsQueryResult {
  data: PlayerStats | undefined;
  isLoading: boolean;
  error: Error | null;
}

const useChessDotComPlayerStats = (username: string): PlayerStatsQueryResult => {
  const { data, isLoading, error } = useQuery<PlayerStats, Error>({
    queryKey: ['chessDotComPlayerStats', username],
    queryFn: () => fetchPlayerStats(username),
    select: (data) => convertKeysToUpperCamelCase(data) as PlayerStats,
  });

  return { data, isLoading, error };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchPlayerStats = async (username: string): Promise<any> => {
  const response = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data; // No conversion here, handled by `select` in useQuery
};

export default useChessDotComPlayerStats;