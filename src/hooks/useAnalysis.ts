import { useState, useEffect } from "react";
import useLichessCloudAnalysis from "./useLichessCloudAnalysis";
import { Pieces, StockfishAnalysisResult } from "../types";
import { parseStockfishOutput } from "../utils/stockfish";
import { STARTING_FEN } from "../utils/constants";

export default function useAnalysis(fen: string, turn: Pieces) {
  const { data: lichessData, isLoading: isLoadingLichess, error: lichessError } = useLichessCloudAnalysis(fen);
  const [stockfishData, setStockfishData] = useState<StockfishAnalysisResult | null>(null);
  const [isLoadingStockfish, setIsLoadingStockfish] = useState(false);

  useEffect(() => {
    async function analyzeWithStockfish() {
      if (!fen || lichessData || fen === STARTING_FEN || isLoadingLichess) {
        return;
      }

      setIsLoadingStockfish(true);
      const worker = new Worker(new URL("../assets/stockfish/stockfishWorker.js", import.meta.url));
      worker.onmessage = (e) => {
        const result = parseStockfishOutput(e.data, turn);
        if (result) {
          setStockfishData(result);
          setIsLoadingStockfish(false);
        }
      };

      //Likely still have work to do here. Not sure if this updates properly
      worker.postMessage("setoption name MultiPV value 3");
      worker.postMessage(`position fen ${fen}`);
      worker.postMessage("go depth 20");

      return () => worker.terminate();
    }

    analyzeWithStockfish();
  }, [fen, lichessData, turn, isLoadingLichess]);

  return {
    data: fen === STARTING_FEN ? [] : lichessData || stockfishData,
    isLoading: isLoadingLichess || isLoadingStockfish,
    error: lichessError
  };
}
