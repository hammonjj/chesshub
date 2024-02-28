import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Grid } from "@mui/material";
import AnalysisTable from "../components/board/AnalysisTable";
import PgnTable from "../components/board/PgnTable";
import useGames from "../hooks/useGames";
import useAnalysis from "../hooks/useAnalysis";
import { convertPgnStringToArray } from "../utils/pgnUtils";
import { STARTING_FEN } from "../utils/constants";

export default function Analysis() {
  const { gameId } = useParams();
  const { games, isLoadingGames } = useGames();
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState<string>(STARTING_FEN);
  const [boardOrientation] = useState<"white" | "black">("white");

  useEffect(() => {
    if (!isLoadingGames && games.length > 0 && gameId) {
      const selectedGame = games.find((g) => g.id === +gameId);
      if (selectedGame) {
        setGame(new Chess(selectedGame.pgn));
      }
    }
  }, [gameId, games, isLoadingGames]);

  const { data: analysisData } = useAnalysis(fen, game.turn() === "w" ? "White" : "Black");

  function onPieceDrop(sourceSquare: Square, targetSquare: Square) {
    const move = game.move({ from: sourceSquare, to: targetSquare });
    if (!move) {
      return false;
    }

    setFen(game.fen());
    return true;
  }

  if (isLoadingGames) {
    return <p>Loading...</p>;
  }

  const evaluationsForTable = analysisData
    ? [analysisData].flat().map((evaluation) => ({
        score: evaluation.score,
        move: evaluation.pv.join(" "),
        multipv: evaluation.multipv
      }))
    : [];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Chessboard position={fen} onPieceDrop={onPieceDrop} boardOrientation={boardOrientation} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AnalysisTable evaluations={evaluationsForTable} fen={fen} />
          </Grid>
          <Grid item xs={12}>
            <PgnTable moves={convertPgnStringToArray(game.pgn())} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
