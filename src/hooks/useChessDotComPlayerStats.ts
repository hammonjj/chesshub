import { useQuery } from '@tanstack/react-query';
import { convertKeysToUpperCamelCase } from '../utils/utils';
import useUser from './useUser';

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
  chessBullet?: ChessVariantStats;
  chessRapid?: ChessVariantStats;
  chessBlitz?: ChessVariantStats;
  fide: number;
  tactics: TacticsStats;
  puzzleRush: PuzzleRushStats;
}

interface PlayerStatsQueryResult {
  data: PlayerStats | undefined;
  isLoading: boolean;
  error: Error | null;
}

const useChessDotComPlayerStats = (): PlayerStatsQueryResult => {
  const { isLoading: isUserDataLoading, externalAccounts } = useUser();
  const chessComAccount = externalAccounts.find((account) => account.platform === 'chess.com');
  const { data, isLoading, error } = useQuery<PlayerStats, Error>({
    queryKey: ['chessDotComPlayerStats', chessComAccount?.accountName],
    queryFn: () => fetchPlayerStats(chessComAccount!.accountName),
    select: (data) => convertKeysToUpperCamelCase(data) as PlayerStats,
    enabled: !isUserDataLoading && !!chessComAccount
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