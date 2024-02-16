import { ParseTree } from "@mliebelt/pgn-parser";
import { Game, Variant } from "../types";

export function getPlayerResult(pgn: ParseTree, pieces: string) {
  if (pgn.tags?.Result === "1-0") {
    return pieces === "White" ? "Win" : "Loss";
  } else if (pgn.tags?.Result === "0-1") {
    return pieces === "Black" ? "Win" : "Loss";
  } else {
    return "Draw";
  }
}

export function getGameObjectFromPgn(pgn: ParseTree, username: string, userProfile: number): Game {
  // @ts-expect-error "Comes from Lichess API, so we know it's there."
  const { White, Site, UTCDate, UTCTime, TimeControl, ECO, Event } = pgn.tags;
  const pieces = White === username ? "White" : "Black";

  return {
    playedAt: new Date(`${UTCDate.value.replace(/\./g, '-')}T${UTCTime.value}Z`),
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

function getVariantFromEvent(event: string) {
  if(event.includes("Bullet")) {
    return "Bullet"
  }
  else if(event.includes("Blitz")) {
    return "Blitz"
  }
  else if(event.includes("Rapid")) {
    return "Rapid"
  }
  else if(event.includes("Classical")) {
    return "Classical"
  }
  else {
    return "Unknown"
  }
}