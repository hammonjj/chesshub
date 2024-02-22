import { useParams } from "react-router-dom";
import useGames from "../hooks/useGames";
import { useEffect, useState } from "react";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { parseStockfishOutput } from "../utils/stockfish";
import { Grid, Typography } from "@mui/material";
import AnalysisTable from "../components/board/AnalysisTable";
import { MoveEvaluation, StockfishAnalysisResult } from "../types";
//import { Polyglot } from 'cm-polyglot/src/polyglot';

export default function Analysis() {
  const { gameId } = useParams();
  const { games, isLoadingGames } = useGames();
  const [game, setGame] = useState(new Chess());
  const [boardOrientation] = useState<'white' | 'black'>('white');
  const [worker, setWorker] = useState<Worker | null>(null);
  const [fen, setFen] = useState<string>();
  const [stockfishEvaluations, setStockfishEvaluations] = useState<Map<number, StockfishAnalysisResult>>(new Map());

  useEffect(() => {
    async function fetchOpeningBook() {
      //const response = await fetch('../assets/stockfish/Human.bin');
      //const arrayBuffer = await response.arrayBuffer();

      // console.log("Array Buffer: ", arrayBuffer.byteLength / 16);
      // for (let i = 0; i < 10; i++) {
      //   const entry = parsePolyglotEntry(arrayBuffer, i);
      //   //console.log("Entry: ", entry);

      //   const decodedMove = decodeMove(entry.move);
      //   console.log("Decoded Move: ", decodedMove);
      // }
      // console.log("Fetching opening book...")
      // const polyglot = new Polyglot('../assets/stockfish/Human.bin');
      // polyglot.getMovesFromFen(new URL('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', import.meta.url)).then((moves) => {
      //   console.log("Opening Book Moves", moves);
    //});
    }

    fetchOpeningBook();
    const newWorker = new Worker(new URL('../assets/stockfish/stockfishWorker.js', import.meta.url));
    newWorker.onmessage = (e) => {
      const result = parseStockfishOutput(e.data);

      if(!result) {
        return;
      }

      console.log("Message from Stockfish worker: ", result);
      setStockfishEvaluations(prevEvaluations => {
        const newEvaluations = new Map(prevEvaluations);
        newEvaluations.set(result.multipv, result);
        return newEvaluations;
      });
    };

    newWorker.postMessage("setoption name MultiPV value 3");
    setWorker(newWorker);

    return () => {
      newWorker.terminate();
    };
  }, []);

  useEffect(() => {
    if(!isLoadingGames && games.length > 0 && gameId) {
      const game = games.find((game) => game.id === +gameId);
      if(game) {
        setGame(new Chess(game.pgn));
        setFen(new Chess(game.pgn).fen());
      }
    }
  }, [gameId, games, isLoadingGames]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onPieceDrop(sourceSquare: Square, targetSquare: Square, _piece: string) {
    try {
      const move = game.move({ from: sourceSquare, to: targetSquare });

      if(move) {
        // Send the move to Stockfish for analysis
        worker?.postMessage(`position fen ${game.fen()}`);
        worker?.postMessage("go depth 20");
      }

      setFen(game.fen());
      return true;
    }
    catch (e) {
      return false;
    }
  }
  
  if(isLoadingGames) {
    return <Chessboard />;
  }

  const evaluationsForTable: MoveEvaluation[] = Array.from(stockfishEvaluations.values()).map(evaluation => ({
    score: evaluation.score,
    move: evaluation.pv.join(' '),
    multipv: evaluation.multipv
  }));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        
        <Chessboard 
          position={fen} 
          onPieceDrop={onPieceDrop}
          boardOrientation={boardOrientation} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AnalysisTable evaluations={evaluationsForTable} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" align="left">
              {game.pgn()}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}