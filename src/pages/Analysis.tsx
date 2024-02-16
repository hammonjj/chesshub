import { Game } from "../types";
import { Chess } from 'chess.js'
import { useState } from "react";
import { Chessboard } from "react-chessboard";

interface AnalysisProps {
  game?: Game;
}

export default function Analysis(props: AnalysisProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [game] = useState(new Chess());
  console.log("Game to Analyze", props.game);
  return (
    <>
      <div>Analysis</div>
      <div style={{height: "800px", width: "800px"}}>
        <Chessboard position={game.fen()} />
      </div>
    </>
  );
}