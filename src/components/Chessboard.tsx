import { Square } from "chess.js";
import { useState } from "react";
import { Chessboard as ReactChessboard } from "react-chessboard";

interface ChessboardProps {
  fen: string;
  isLoading: boolean;
  orientation: "white" | "black";
  onPieceDrop: () => void;
}

export default function Chessboard(props: ChessboardProps) {
  const [boardOrientation] = useState<"white" | "black">("white");
  console.log("ChessboardProps", props.fen);

  function onPieceDrop(sourceSquare: Square, targetSquare: Square) {
    console.log("onPieceDrop", sourceSquare, targetSquare);
    //Play sound and call parent
    props.onPieceDrop();
    return true;
  }

  if (props.isLoading) {
    return <ReactChessboard />;
  }

  return <ReactChessboard position={props.fen} onPieceDrop={onPieceDrop} boardOrientation={boardOrientation} />;
}
