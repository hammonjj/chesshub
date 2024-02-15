import { Game, Variant } from "../types";
import { parseGame } from '@mliebelt/pgn-parser'
import { getPlayerResult } from "./pgnUtils";

interface RawChessDotComGame {
  url: string;
  pgn: string;
  timeControl: string;
  endTime: number;
  rated: boolean;
  accuracies: {
    white: number;
    black: number;
  };
  tcn: string;
  uuid: string;
  initialSetup: string;
  fen: string;
  timeClass: string;
  rules: string;
  white: {
    rating: number;
    result: string;
    id: string;
    username: string;
    uuid: string;
  };
  black: {
    rating: number;
    result: string;
    id: string;
    username: string;
    uuid: string;
  };
}

interface GameArchive {
  month: number;
  year: number;
  date: string;
  archivesUrl: string;
}

export const convertRawChessDotComGameToGame = (rawGame: RawChessDotComGame, username: string, userProfile: number): Game => {
  const { white, endTime, timeClass, url, timeControl } = rawGame;
  const pieces = white.username.toLowerCase() === username.toLowerCase() ? 'White': 'Black';

  const rawPgn = parseGame(rawGame.pgn);
  const result = getPlayerResult(rawPgn, pieces);

  return {
    playedAt: new Date(endTime * 1000),
    url: url,
    timeControl: timeControl,
    variant: timeClass[0].toUpperCase() + timeClass.slice(1) as Variant,
    userProfile: userProfile,
    pgn: rawGame.pgn,
    pieces: pieces,
    moves: Math.ceil(rawPgn.moves.length / 2),
    eco: "Unknown",
    result: result,
    platform: 'chess.com',
    uuid: rawGame.uuid,
  };
}

export const fetchGamesArchive = async (url: string): Promise<RawChessDotComGame[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ret: RawChessDotComGame[] = data.games.map((game: any) => {
    return {
      url: game.url,
      pgn: game.pgn,
      timeControl: game.time_control,
      endTime: game.end_time,
      rated: game.rated,
      accuracies: game.accuracies,
      tcn: game.tcn,
      uuid: game.uuid,
      initialSetup: game.initial_setup,
      fen: game.fen,
      timeClass: game.time_class,
      rules: game.rules,
      white: game.white,
      black: game.black
    };
  });

  return ret;
};

export const fetchGameArchiveList = async (username: string): Promise<GameArchive[]> => {
  const response = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const json = await response.json();
  const archives: GameArchive[] = json.archives.map((url: string): GameArchive => {
    const matches = url.match(/\/(\d{4})\/(\d{2})$/);
    if (!matches) {
      throw new Error('Unexpected URL format');
    }

    const [, year, month] = matches;
    return {
      date: `${year}-${month}`,
      year: parseInt(year),
      month: parseInt(month),
      archivesUrl: url,
    };
  });

  return archives;
};