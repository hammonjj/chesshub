import { ParseTree, parseGame } from "@mliebelt/pgn-parser";
import { Game, GameStats, Pieces, Result, Variant } from "../types";

export function getPlayerResult(pgn: ParseTree, pieces: string) {
  if (pgn.tags?.Result === "1-0") {
    return pieces === "White" ? "Win" : "Loss";
  } else if (pgn.tags?.Result === "0-1") {
    return pieces === "Black" ? "Win" : "Loss";
  } else {
    return "Draw";
  }
}

export function getGameObjectFromPgn(
  pgn: ParseTree,
  username: string,
  userProfile: number
): Game {
  // @ts-expect-error "Comes from Lichess API, so we know it's there."
  const { White, Site, TimeControl, ECO, Event } = pgn.tags;
  const pieces = White === username ? "White" : "Black";

  return {
    playedAt: new Date(
      Date.UTC(
        pgn.tags?.UTCDate.year ?? 0,
        (pgn.tags?.UTCDate.month ?? 0) - 1,
        pgn.tags?.UTCDate.day,
        pgn.tags?.UTCTime.hour,
        pgn.tags?.UTCTime.minute,
        pgn.tags?.UTCTime.second
      )
    ),
    url: Site,
    timeControl: TimeControl.value,
    variant: getVariantFromEvent(Event) as Variant,
    userProfile: userProfile,
    pgn: pgn.toString(),
    pieces: pieces,
    moves: Math.ceil(pgn.moves.length / 2),
    eco: ECO,
    result: getPlayerResult(pgn, pieces),
    platform: "lichess"
  };
}

//Probably want to actually use a real library for this, but this will suffice for now
export function findMatchingGamesByPgn(
  games: Game[],
  targetPgn: string
): Game[] {
  const parsedTargetPgn = parseGame(targetPgn);

  return games.filter((game) => {
    const parsedGamePgn = parseGame(game.pgn);
    if (parsedGamePgn.moves.length < parsedTargetPgn.moves.length) {
      return false;
    }

    for (let i = 0; i < parsedTargetPgn.moves.length; i++) {
      if (
        parsedGamePgn.moves[i].notation.notation.toLowerCase() !==
        parsedTargetPgn.moves[i].notation.notation.toLowerCase()
      ) {
        return false;
      }
    }

    return true;
  });
}

export function getWinLossDrawStats(games: Game[], pieces: Pieces): GameStats {
  const stats = games.reduce(
    (acc, game) => {
      if (game.pieces !== pieces) {
        return acc;
      }

      if (game.result === "Win") {
        acc.wins++;
      } else if (game.result === "Loss") {
        acc.losses++;
      } else {
        acc.draws++;
      }

      return acc;
    },
    { wins: 0, losses: 0, draws: 0, total: games.length }
  );

  return stats;
}

export function applyGameFilters(
  games: Game[],
  pieces: Pieces,
  variant: Variant | "All",
  result: Result | "All",
  dateRange: string
): Game[] {
  return games.filter((game) => {
    if (!applyDateFilter(game, dateRange)) {
      return false;
    }

    if (game.pieces !== pieces) {
      return false;
    }

    if (!applyVariantFilter(game, variant)) {
      return false;
    }

    if (!applyResultFilter(game, result)) {
      return false;
    }

    return true;
  });
}

export function applyDateFilter(game: Game, dateRange: string) {
  if (dateRange === "all-time") {
    return true;
  }
  if (
    dateRange === "this-week" &&
    game.playedAt > new Date(new Date().setDate(new Date().getDate() - 7))
  ) {
    return true;
  }
  if (
    dateRange === "this-month" &&
    game.playedAt > new Date(new Date().setMonth(new Date().getMonth() - 1))
  ) {
    return true;
  }
  if (
    dateRange === "last-three-months" &&
    game.playedAt > new Date(new Date().setMonth(new Date().getMonth() - 3))
  ) {
    return true;
  }
  if (
    dateRange === "this-year" &&
    game.playedAt >
      new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  ) {
    return true;
  }

  return false;
}

export function applyVariantFilter(game: Game, variant: Variant | "All") {
  if (variant === "All") {
    return true;
  }

  return game.variant === variant;
}

function applyResultFilter(game: Game, result: Result | "All") {
  if (result === "All") {
    return true;
  }

  return game.result === result;
}

function getVariantFromEvent(event: string) {
  if (event.includes("Bullet")) {
    return "Bullet";
  } else if (event.includes("Blitz")) {
    return "Blitz";
  } else if (event.includes("Rapid")) {
    return "Rapid";
  } else if (event.includes("Classical")) {
    return "Classical";
  } else {
    return "Unknown";
  }
}

export function convertPgnStringToArray(pgn: string): string[][] {
  return pgn
    .split(/\d+\./)
    .slice(1)
    .map((move) => move.trim().split(" "));
}
