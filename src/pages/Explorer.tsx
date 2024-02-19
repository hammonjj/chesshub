import { Chess, Square } from 'chess.js'
import { useReducer, useState } from "react";
import { Chessboard } from "react-chessboard";
import useGames from "../hooks/useGames";
import ExplorerFilters from "../components/board/ExplorerFilters";
import { applyGameFilters, findMatchingGamesByPgn } from '../utils/pgnUtils';
import MoveList from '../components/board/MoveList';
import { DefaultFen, Pieces } from '../types';

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
  
  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <div style={{ height: "600px", width: "600px" }}>
        <Chessboard 
          position={fen} 
          onPieceDrop={onPieceDrop}
          boardOrientation={state.flipBoard ? 'black' : 'white'} />
      </div>
      <div style={{ marginLeft: "25px" }}>
        <div style={{ marginBottom: "10px"}}>
          <ExplorerFilters state={state} dispatch={dispatch} />
        </div>
        <div>
          <MoveList games={filteredGames} moveNumber={game.moveNumber()} turn={game.turn()}/>
          <button onClick={resetGame}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}