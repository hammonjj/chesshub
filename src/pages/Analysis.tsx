import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Grid } from "@mui/material";
import AnalysisTable from "../components/board/AnalysisTable";
import useGames from "../hooks/useGames";
import useAnalysis from "../hooks/useAnalysis";
import { STARTING_FEN } from "../utils/constants";
import BoardControls from "../components/board/BoardControls";
import PgnHistoryTable from "../components/board/PgnHistoryTable";

export default function Analysis() {
  const { gameId } = useParams();
  const { games, isLoadingGames } = useGames();
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState<string>(STARTING_FEN);
  const [boardOrientation] = useState<"white" | "black">("white");

  //Create a collection of moves
  //{
  //  move: "e4",
  //  moveNumber: 1,
  //  turn: "w",
  //  fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
  //}
  //
  //Put this in an array so the moves are already in order
  //Pass the array to the PgnHistoryTable component, along with the current move number and turn
  //The chess object is really only used for games the user is currently inputing, not their previous games
  //
  //Might need to revisit this when working on variations, but I'll cross that bridge when I get to it

  useEffect(() => {
    if (isLoadingGames || games.length === 0 || !gameId) {
      return;
    }

    const selectedGame = games.find((g) => g.id === +gameId);

    if (!selectedGame) {
      return;
    }
    const tmpGame = new Chess();
    console.log("selectedGame.pgn", selectedGame.pgn);
    //tmpGame.loadPgn(selectedGame.pgn);
    setGame(tmpGame);
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
            <BoardControls resetGame={() => {}} goBackMove={() => {}} goForwardMove={() => {}} goLastMove={() => {}} />
          </Grid>
          <Grid item xs={12}>
            <PgnHistoryTable
              moves={game.history()}
              moveNumber={game.moveNumber() === 1 && game.turn() === "w" ? 0 : game.moveNumber()}
              turn={game.turn()}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
