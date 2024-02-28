import { Chess, Square } from "chess.js";
import { useReducer, useState } from "react";
import { Chessboard } from "react-chessboard";
import useGames from "../hooks/useGames";
import ExplorerFilters from "../components/board/ExplorerFilters";
import { applyGameFilters, findMatchingGamesByPgn } from "../utils/pgnUtils";
import MoveExplorer from "../components/board/MoveExplorer";
import { DefaultFen, Pieces } from "../types";
import { Grid, Typography, IconButton } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

export interface ExplorerFilterState {
  color: Pieces;
  date: string;
  variant: "All" | "Bullet" | "Rapid" | "Blitz" | "Classical";
  outcome: "All" | "Win" | "Loss" | "Draw";
  flipBoard: boolean;
}

export type ExplorerFilterAction =
  | { type: "SET_COLOR"; payload: Pieces }
  | { type: "SET_DATE"; payload: string }
  | { type: "SET_VARIANT"; payload: "All" | "Bullet" | "Rapid" | "Blitz" | "Classical" }
  | { type: "SET_OUTCOME"; payload: "All" | "Win" | "Loss" | "Draw" }
  | { type: "FLIP_BOARD" };

const initialState: ExplorerFilterState = {
  color: "White",
  date: "all-time",
  variant: "All",
  outcome: "All",
  flipBoard: false
};

const filterReducer = (state: ExplorerFilterState, action: ExplorerFilterAction) => {
  switch (action.type) {
    case "SET_COLOR":
      return { ...state, color: action.payload, flipBoard: !state.flipBoard };
    case "SET_DATE":
      return { ...state, date: action.payload };
    case "SET_VARIANT":
      return { ...state, variant: action.payload };
    case "SET_OUTCOME":
      return { ...state, outcome: action.payload };
    case "FLIP_BOARD":
      return { ...state, flipBoard: !state.flipBoard };
    default:
      return state;
  }
};

export default function Explorer() {
  const { games, isLoadingGames } = useGames();

  const [state, dispatch] = useReducer(filterReducer, initialState);
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [arrows, setArrows] = useState<Array<[Square, Square]>>([]);

  if (isLoadingGames) {
    return <Chessboard />;
  }

  const firstFilteredGames = applyGameFilters(games, state.color, state.variant, state.outcome, state.date);
  const filteredGames =
    game.fen() === DefaultFen ? firstFilteredGames : findMatchingGamesByPgn(firstFilteredGames, game.pgn());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onPieceDrop(sourceSquare: Square, targetSquare: Square, _piece: string) {
    try {
      game.move({ from: sourceSquare, to: targetSquare });
      setFen(game.fen());
      return true;
    } catch (e) {
      return false;
    }
  }

  function onMoveExplorerClick(move: string) {
    game.move(move);
    setFen(game.fen());
  }

  const onMoveHover = (moveNotation: string) => {
    const moves = game.moves({ verbose: true });
    const move = moves.find((m) => m.san === moveNotation);
    if (move) {
      setArrows([[move.from, move.to]]);
    }
  };

  const onMoveHoverLeave = () => {
    setArrows([]);
  };

  function resetGame() {
    setGame(new Chess());
    setFen(new Chess().fen());
  }

  function backMove() {
    game.undo();
    setFen(game.fen());
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
        <Chessboard
          position={fen}
          onPieceDrop={onPieceDrop}
          customArrows={arrows}
          boardOrientation={state.flipBoard ? "black" : "white"}
        />
      </Grid>
      <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
        <Grid container direction="column">
          <Grid item xs={12}>
            <ExplorerFilters state={state} dispatch={dispatch} />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={0}>
              <Grid item xs={4}>
                <IconButton onClick={resetGame} size="small">
                  <FirstPageIcon />
                </IconButton>
                <IconButton onClick={backMove} size="small">
                  <KeyboardArrowLeftIcon />
                </IconButton>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1" align="left">
                  {game.pgn()}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <MoveExplorer
              games={filteredGames}
              moveNumber={game.moveNumber()}
              turn={game.turn()}
              onMoveClick={onMoveExplorerClick}
              onMoveHover={onMoveHover}
              onMoveHoverLeave={onMoveHoverLeave}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
