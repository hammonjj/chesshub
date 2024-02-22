import { StockfishAnalysisResult } from "../types";

/* Stockfish Parsing */
export function parseStockfishOutput(output: string): StockfishAnalysisResult | null {
  const depthMatch = output.match(/depth (\d+)/);
  const scoreMatch = output.match(/score cp (-?\d+)/);
  const multipvMatch = output.match(/multipv (\d+)/);
  const pvMatch = output.match(/pv (.+)/);

  if (!depthMatch || !scoreMatch || !multipvMatch || !pvMatch) {
    return null;
  }

  return {
    depth: parseInt(depthMatch[1], 10),
    score: parseInt(scoreMatch[1], 10) / 100,
    multipv: parseInt(multipvMatch[1], 10),
    pv: extractMovesFromArray(pvMatch[1].trim().split(' ')),
  };
}

function extractMovesFromArray(inputArray: string[]): string[] {
  const pvIndex = inputArray.indexOf("pv");
  return pvIndex === -1 ? [] : inputArray.slice(pvIndex + 1);
}

/* Opening Book Parsing */
export async function fetchOpeningBook() {
  const response = await fetch('../assets/stockfish/Human.bin');
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}

export function parsePolyglotEntry(buffer, entryIndex) {
  const dataView = new DataView(buffer);
  const baseIndex = entryIndex * 16; // Each entry is 16 bytes
  const keyHigh = dataView.getUint32(baseIndex, false); // Polyglot keys are big-endian
  const keyLow = dataView.getUint32(baseIndex + 4, false);
  const move = dataView.getUint16(baseIndex + 8, false);
  
  // Convert the move into a more usable format here...
  
  return { keyHigh, keyLow, move };
}

export function decodeMove(move) {
  const from = move & 0x3F; // Extract bits 0-5
  const to = (move >> 6) & 0x3F; // Extract bits 6-11
  const promotion = (move >> 12) & 0x3; // Extract bits 12-13

  // Convert these to human-readable formats
  const fromSquare = indexToSquare(from);
  const toSquare = indexToSquare(to);
  const promotionPiece = ['none', 'knight', 'bishop', 'rook', 'queen'][promotion];

  return { fromSquare, toSquare, promotionPiece };
}

// Converts a square index (0-63) to algebraic notation (a1-h8)
function indexToSquare(index) {
  const file = 'abcdefgh'[index % 8];
  const rank = Math.floor(index / 8) + 1;
  return `${file}${rank}`;
}