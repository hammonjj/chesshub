import { StockfishAnalysisResult } from "../types";

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