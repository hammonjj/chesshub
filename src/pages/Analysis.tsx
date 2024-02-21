import { useParams } from "react-router-dom";
import useGames from "../hooks/useGames";
import { useEffect, useState } from "react";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { parseStockfishOutput } from "../utils/stockfish";
import { Grid, Typography } from "@mui/material";

export default function Analysis() {
  const { gameId } = useParams();
  const { games, isLoadingGames } = useGames();
  const [game, setGame] = useState(new Chess());
  const [boardOrientation] = useState<'white' | 'black'>('white');
  const [worker, setWorker] = useState<Worker | null>(null);
  const [fen, setFen] = useState<string>();

  useEffect(() => {
    const newWorker = new Worker(new URL('../assets/stockfish/stockfishWorker.js', import.meta.url));
    newWorker.onmessage = (e) => {
      const msg = parseStockfishOutput(e.data);
      console.log("Message from Stockfish worker: ", msg);
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Chessboard 
          position={fen} 
          onPieceDrop={onPieceDrop}
          boardOrientation={boardOrientation} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="body1" align="left">
          {game.pgn()}
        </Typography>
      </Grid>
    </Grid>
  );
}