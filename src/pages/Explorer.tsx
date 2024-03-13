import { Chess, Square } from "chess.js";
import { useReducer, useState } from "react";
import { Chessboard } from "react-chessboard";
import useGames from "../hooks/useGames";
import ExplorerFilters from "../components/board/ExplorerFilters";
import { applyGameFilters, findMatchingGamesByPgn } from "../utils/pgnUtils";
import MoveExplorer from "../components/board/MoveExplorer";
import { DefaultFen, Pieces } from "../types";
import { Grid, Typography } from "@mui/material";
import BoardControls from "../components/board/BoardControls";

export interface ExplorerFilterState {
  color: Pieces;
  date: string;
  variant: "All" | "Bullet" | "Rapid" | "Blitz" | "Classical";
  outcome: "All" | "Win" | "Loss" | "Draw";
  flipBoard: boolean;
  betweenDates?: { startDate: Date; endDate: Date };
}

export type ExplorerFilterAction =
  | { type: "SET_COLOR"; payload: Pieces }
  | { type: "SET_DATE"; payload: string }
  | { type: "SET_VARIANT"; payload: "All" | "Bullet" | "Rapid" | "Blitz" | "Classical" }
  | { type: "SET_OUTCOME"; payload: "All" | "Win" | "Loss" | "Draw" }
  | { type: "FLIP_BOARD" }
  | { type: "SET_CUSTOM_DATE_RANGE"; payload: { startDate: Date; endDate: Date } };

const initialState: ExplorerFilterState = {
  color: "White",
  date: "all-time",
  variant: "All",
  outcome: "All",
  flipBoard: false,
  betweenDates: undefined
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
    case "SET_CUSTOM_DATE_RANGE":
      //This is pretty gross. I need to eventually update this to just give the reducer explicit start and end dates
      //instead of worrying about the string values for month, week, etc.
      return {
        ...state,
        date: "custom",
        betweenDates: { startDate: action.payload.startDate, endDate: action.payload.endDate }
      };

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
  const [customStyles, setCustomStyles] = useState<{ [key: string]: React.CSSProperties }>({});

  if (isLoadingGames) {
    return <Chessboard />;
  }

  const firstFilteredGames = applyGameFilters(
    games,
    state.color,
    state.variant,
    state.outcome,
    state.date,
    state.betweenDates?.startDate,
    state.betweenDates?.endDate
  );

  const filteredGames =
    game.fen() === DefaultFen ? firstFilteredGames : findMatchingGamesByPgn(firstFilteredGames, game.pgn());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onPieceDrop(sourceSquare: Square, targetSquare: Square, _piece: string) {
    try {
      game.move({ from: sourceSquare, to: targetSquare });
      setFen(game.fen());
    } catch (e) {
      return false;
    }

    setArrows([]);
    setCustomStyles({});
    playPieceDropAudio();

    return true;
  }

  function playPieceDropAudio() {
    try {
      const audio = new Audio("/move.mp3");
      audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  function onMoveExplorerClick(move: string) {
    game.move(move);
    setArrows([]);
    setCustomStyles({});
    setFen(game.fen());
    playPieceDropAudio();
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

  function onSquareRightClick(square: Square) {
    const newStyles = {
      ...customStyles,
      [square]: {
        backgroundColor: "rgba(255, 0, 0, 0.5)"
      }
    };
    setCustomStyles(newStyles);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onSquareLeftClick(_square: Square) {
    setCustomStyles({});
    setArrows([]);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
        <Chessboard
          position={fen}
          onPieceDrop={onPieceDrop}
          customArrows={arrows}
          boardOrientation={state.flipBoard ? "black" : "white"}
          customSquareStyles={customStyles}
          onSquareRightClick={onSquareRightClick}
          onSquareClick={onSquareLeftClick}
        />
      </Grid>
      <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
        <Grid container direction="column">
          <Grid item xs={12}>
            <ExplorerFilters state={state} dispatch={dispatch} />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} direction="column">
              <Grid item xs={4}>
                <BoardControls
                  resetGame={resetGame}
                  goBackMove={backMove}
                  goForwardMove={() => {}}
                  goLastMove={() => {}}
                />
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
