import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalAccount, Game } from "../types";
import { supabase } from "../utils/supabaseClient";
import useUser from "./useUser";
import { fetchGamesArchive, fetchGameArchiveList, convertRawChessDotComGameToGame } from "../utils/chessDotCom";

export default function useGames() {
  const queryClient = useQueryClient();
  const { userProfile, isLoading: isUserDataLoading, externalAccounts } = useUser();

  const { data, isLoading, isError } = useQuery<Game[], Error>({
    queryKey: ["games"],
    queryFn: () => fetchGames(userProfile!.id),
    enabled: !!userProfile
  });

  async function syncExternalAccountsToLocalDb() {
    if (!externalAccounts.length || !userProfile) {
      return;
    }

    const chessComAccount = externalAccounts.find((account) => account.platform === 'chess.com');
    if (chessComAccount) { 
      syncChessDotComGames(chessComAccount); 
    }

    const lichessAccount = externalAccounts.find((account) => account.platform === 'lichess');
    if (lichessAccount) { 
      syncLichessGames(lichessAccount); 
    }
  }

  async function syncChessDotComGames(chessComAccount: ExternalAccount) {
    console.log("Syncing Chess.com games to local database", chessComAccount);
    const mostRecentChessComGame = data?.find((game) => game.platform === "chess.com");
    if (!mostRecentChessComGame) {
      console.log("No Chess.com games found in local data. Syncing all available archives.");
    }

    let gamesToInsert: Game[] = [];
    try {
      const archives = await fetchGameArchiveList(chessComAccount.accountName);
      const mostRecentGameDate = mostRecentChessComGame ? new Date(mostRecentChessComGame.playedAt) : null;

      for (const archive of archives) {
        const archiveDateMatches = /\/(\d{4})\/(\d{2})$/.exec(archive.archivesUrl);
        if (!archiveDateMatches) {
          continue;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, archiveYear, archiveMonth] = archiveDateMatches;
        const archiveDate = new Date(`${archiveYear}-${archiveMonth}-01`);

        // Proceed if the archive is for the month of the most recent game or later.
        if (!mostRecentGameDate || archiveDate >= mostRecentGameDate) {
          const archiveGames = await fetchGamesArchive(archive.archivesUrl);

          const gamesObjList = archiveGames.map(
            (rawGame) => convertRawChessDotComGameToGame(rawGame, chessComAccount.accountName, userProfile!.id));

          gamesToInsert = gamesToInsert.concat(gamesObjList);
        }
      }

      gamesToInsert = gamesToInsert.filter((game) => !data?.some((existingGame) => existingGame.uuid === game.uuid));

      if (!gamesToInsert.length) {
        console.log("No new games to insert");
        return;
      }

      const { error } = await supabase.from('ChessHub_Games').insert(gamesToInsert);

      if(error) {
        console.log("Error inserting games", error);
        throw new Error('Failed to insert games');
      }

      //Will convert to mutation later
      queryClient.invalidateQueries({ queryKey: ['games'] });      
    } catch (error) {
      console.error('Failed to sync external accounts:', error);
    }
  }

  async function syncLichessGames(lichessAccount: ExternalAccount) {
    console.log("Syncing Lichess.com games to local database", lichessAccount);
  }

  const games = data ?? [];
  const isLoadingGames = isLoading || isUserDataLoading;

  return { games, isLoadingGames, isError, syncExternalAccountsToLocalDb };
}

async function fetchGames(userProfileId: number): Promise<Game[]> {
  const { data, error } = await supabase
    .from('ChessHub_Games')
    .select('id, playedAt, url, timeControl, createdAt, platform, pgn, pieces, moves, eco, variant, result, uuid')
    .eq('userProfile', userProfileId)
    .order('playedAt', { ascending: false });

  if (error || !data) {
    throw new Error('Failed to fetch games');
  }

  const games = data.map((game) => ({
    id: game.id,
    playedAt: new Date(game.playedAt),
    url: game.url,
    timeControl: game.timeControl,
    variant: game.variant,
    userProfile: userProfileId,
    pgn: game.pgn,
    pieces: game.pieces,
    moves: game.moves,
    eco: game.eco,
    result: game.result,
    platform: game.platform,
    uuid: game.uuid,
  }));

  return games;
}
