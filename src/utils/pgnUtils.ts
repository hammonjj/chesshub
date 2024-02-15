import { ParseTree } from "@mliebelt/pgn-parser";

export function getPlayerResult(pgn: ParseTree, pieces: string) {
  if (pgn.tags?.Result === "1-0") {
    return pieces === "White" ? "Win" : "Loss";
  } else if (pgn.tags?.Result === "0-1") {
    return pieces === "Black" ? "Win" : "Loss";
  } else {
    return "Draw";
  }
}