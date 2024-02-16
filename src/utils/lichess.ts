import { parseGame, split } from '@mliebelt/pgn-parser'
import { Game } from '../types';
import { getGameObjectFromPgn } from './pgnUtils';

export async function fetchLichessGames(username: string, userProfile: number, sinceDate: Date | null = null) {
  const sinceString = sinceDate ? `?since=${sinceDate.getTime() + (1000*60)}` : '';
  const response = await fetch(`https://lichess.org/api/games/user/${username}${sinceString}`);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const textResponse = await response.text();
  const splitGames = split(textResponse);
  const gameList: Game[] = splitGames.map((rawGame) => {
    const parsedGame = parseGame(rawGame.all);
    const gameObj = getGameObjectFromPgn(parsedGame, username, userProfile);
    return {...gameObj, pgn: rawGame.all};
  });

  return gameList;
}