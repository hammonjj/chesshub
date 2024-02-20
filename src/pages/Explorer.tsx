import { Chess, Square } from 'chess.js'
import { useReducer, useState } from "react";
import { Chessboard } from "react-chessboard";
import useGames from "../hooks/useGames";
import ExplorerFilters from "../components/board/ExplorerFilters";
import { applyGameFilters, findMatchingGamesByPgn } from '../utils/pgnUtils';
import MoveList from '../components/board/MoveList';
import { DefaultFen, Pieces } from '../types';
import { Grid } from '@mui/material';

export interface ExplorerFilterState {
  color: Pieces;
  date: string;
  variant: 'All' | 'Bullet' | 'Rapid' | 'Blitz' | 'Classical';
  outcome: 'All' | 'Win' | 'Loss' | 'Draw';
  flipBoard: boolean;
}

export type ExplorerFilterAction =
  | { type: 'SET_COLOR'; payload: Pieces }
  | { type: 'SET_DATE'; payload: string }
  | { type: 'SET_VARIANT'; payload: 'All' | 'Bullet' | 'Rapid' | 'Blitz' | 'Classical' }
  | { type: 'SET_OUTCOME'; payload: 'All' | 'Win' | 'Loss' | 'Draw' }
  | { type: 'FLIP_BOARD' };

const initialState: ExplorerFilterState = {
  color: 'White',
  date: 'all-time',
  variant: 'All',
  outcome: 'All',
  flipBoard: false,
};

const filterReducer = (state: ExplorerFilterState, action: ExplorerFilterAction) => {
  switch (action.type) {
    case 'SET_COLOR':
      return { ...state, color: action.payload };
    case 'SET_DATE':
      return { ...state, date: action.payload };
    case 'SET_VARIANT':
      return { ...state, variant: action.payload };
    case 'SET_OUTCOME':
      return { ...state, outcome: action.payload };
    case 'FLIP_BOARD':
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

  if(isLoadingGames) {
    return <Chessboard />;
  }

  const firstFilteredGames = applyGameFilters(
    games, state.color, state.variant, state.outcome, state.date);
  const filteredGames = game.fen() === DefaultFen ? 
    firstFilteredGames : findMatchingGamesByPgn(firstFilteredGames, game.pgn());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onPieceDrop(sourceSquare: Square, targetSquare: Square, _piece: string) {
    try {
      game.move({ from: sourceSquare, to: targetSquare });
      setFen(game.fen());
      return true;
    }
    catch (e) {
      return false;
    }
  }

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
      <Grid item xs={12} md={8}>
        <Chessboard 
          position={fen} 
          onPieceDrop={onPieceDrop}
          boardOrientation={state.flipBoard ? 'black' : 'white'} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <ExplorerFilters state={state} dispatch={dispatch} />
          </Grid>
          <Grid item xs={12}>
            <div>{game.pgn()}</div>
            <button onClick={backMove}>Back</button>
            <button onClick={resetGame}>Reset</button>
          </Grid>
          <Grid item xs={12}>
            <MoveList 
              games={filteredGames} 
              moveNumber={game.moveNumber()} 
              turn={game.turn()}
              currentPgn={game.pgn()}/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}