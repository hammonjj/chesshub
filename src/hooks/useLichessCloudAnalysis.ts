import { useQuery } from "@tanstack/react-query";
import { StockfishAnalysisResult } from "../types";
import { STARTING_FEN } from "../utils/constants";

export default function useLichessCloudAnalysis(fen: string) {
  const { data, isLoading, error } = useQuery<StockfishAnalysisResult[], Error>({
    queryKey: ["lichessCloudAnalysis", fen],
    queryFn: () => fetchCloudAnalysis(fen),
    enabled: !!fen && fen !== STARTING_FEN
  });
  console.log("useLichessCloudAnalysis: ", data, isLoading, error);
  return { data, isLoading, error };
}

async function fetchCloudAnalysis(fen: string): Promise<StockfishAnalysisResult[]> {
  const response = await fetch(`https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}&multiPv=4`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();

  return data.pvs.map(
    (pv: { moves: string; cp: number; mate?: number }, index: number): StockfishAnalysisResult => ({
      depth: data.depth, // Use the overall depth from the response
      score: +(pv.cp / 100).toFixed(2) || (pv.mate ? pv.mate * 10000 : 0), // Use cp or convert mate to a large value
      multipv: index + 1, // Index + 1 to indicate the order of best moves
      pv: pv.moves.split(" ") // Split the moves string into an array
    })
  );
}
