import { useQuery } from "@tanstack/react-query";
import useUser from "./useUser";

interface UserPerformance {
  games: number;
  rating: number;
  rd: number;
  prog: number;
  prov?: boolean;
}

interface UserPerformances {
  blitz: UserPerformance;
  puzzle: UserPerformance;
  bullet: UserPerformance;
  correspondence: UserPerformance;
  classical: UserPerformance;
  rapid: UserPerformance;
}

interface PlayTime {
  total: number;
  tv: number;
}

interface GameCount {
  all: number;
  rated: number;
  ai: number;
  draw: number;
  drawH: number;
  loss: number;
  lossH: number;
  win: number;
  winH: number;
  bookmark: number;
  playing: number;
  import: number;
  me: number;
}

interface UserProfile {
  id: string;
  username: string;
  perfs: UserPerformances;
  createdAt: number;
  seenAt: number;
  playTime: PlayTime;
  url: string;
  count: GameCount;
  followable: boolean;
  following: boolean;
  blocking: boolean;
  followsYou: boolean;
}

interface LichessPlayerStatsQueryResult {
  data: UserProfile | undefined;
  isLoading: boolean;
  error: Error | null;
}

export default function useLichessPlayerStats(): LichessPlayerStatsQueryResult {
  const { isLoading: isUserDataLoading, externalAccounts } = useUser();
  
  const lichessAccount = externalAccounts.find((account) => account.platform === 'lichess');
  const { data, isLoading, error } = useQuery<UserProfile, Error>({
    queryKey: ['lichessPlayerStats', lichessAccount?.accountName],
    queryFn: () => fetchLichessPlayerStats(lichessAccount!.accountName),
    enabled: !isUserDataLoading && !!lichessAccount
  });

  return { data, isLoading, error };
}

async function fetchLichessPlayerStats(username: string): Promise<UserProfile> {
  const response = await fetch(`https://lichess.org/api/user/${username}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data: UserProfile = await response.json();
  return data;
}