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
import { BoardMove } from "../types";

export default function Analysis() {
  const { gameId } = useParams();
  const { games, isLoadingGames } = useGames();
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState<string>(STARTING_FEN);
  const [boardOrientation] = useState<"white" | "black">("white");
  const [currentMoveNumber, setCurrentMoveNumber] = useState(0);
  const [moves, setMoves] = useState<BoardMove[]>([]);
  const { data: analysisData } = useAnalysis(fen, currentMoveNumber % 2 === 0 ? "White" : "Black");

  useEffect(() => {
    if (isLoadingGames || games.length === 0 || !gameId) {
      return;
    }

    const selectedGame = games.find((g) => g.id === +gameId);

    if (!selectedGame) {
      return;
    }
    const tmpGame = new Chess();
    tmpGame.loadPgn(selectedGame.pgn), { sloppy: true };
    setCurrentMoveNumber(0);
    setGame(tmpGame);

    //Need to now parse the history of the game moves and translate that to the moves array
    const movesArray: BoardMove[] = [];
    const history = tmpGame.history({ verbose: true });
    history.forEach((move, index) => {
      const moveToAdd: BoardMove = {
        notation: move.san,
        moveNumber: index,
        turn: move.color,
        fen: move.after
      };
      movesArray.push(moveToAdd);
    });

    setMoves(movesArray);
  }, [gameId, games, isLoadingGames]);

  function onPieceDrop(sourceSquare: Square, targetSquare: Square) {
    const move = game.move({ from: sourceSquare, to: targetSquare });
    //console.log("move.san", move.san);
    //console.log("nextMoveSan", moves[currentMoveNumber]?.notation);

    if (!move) {
      return false;
    }

    //Check if the move made by the user is actually the next move in the moves array
    //  - If it is, then move the piece, increment the move number and set the fen
    //  - If it isn't, we'll deal with variations later

    if (currentMoveNumber < moves.length) {
      setFen(moves[currentMoveNumber + 1].fen);
    } else {
      const moveToAdd: BoardMove = {
        notation: move.san,
        moveNumber: currentMoveNumber,
        turn: game.turn(),
        fen: game.fen()
      };

      setFen(game.fen());
      setMoves([...moves, moveToAdd]);
    }

    setCurrentMoveNumber((currentMoveNumber) => currentMoveNumber + 1);
    return true;
  }

  function resetGame() {
    setCurrentMoveNumber(0);
    setFen(STARTING_FEN);
  }

  function goBackMove() {
    if (currentMoveNumber === 0) {
      return;
    }

    if (currentMoveNumber === 1) {
      setFen(STARTING_FEN);
      setCurrentMoveNumber(0);
      return;
    }

    setFen(moves[currentMoveNumber - 2].fen);
    setCurrentMoveNumber((currentMoveNumber) => currentMoveNumber - 1);
  }

  function goForwardMove() {
    if (currentMoveNumber === moves.length) {
      return;
    }

    setFen(moves[currentMoveNumber].fen);
    setCurrentMoveNumber((currentMoveNumber) => currentMoveNumber + 1);
  }

  function goLastMove() {
    if (moves.length === 0) {
      return;
    }

    setFen(moves[moves.length - 1].fen);
    setCurrentMoveNumber(moves.length);
  }

  if (isLoadingGames) {
    return <Chessboard />;
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
            <BoardControls
              resetGame={resetGame}
              goBackMove={goBackMove}
              goForwardMove={goForwardMove}
              goLastMove={goLastMove}
            />
          </Grid>
          <Grid item xs={12}>
            <PgnHistoryTable
              moves={moves}
              moveNumber={currentMoveNumber}
              turn={currentMoveNumber % 2 === 0 ? "w" : "b"}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
