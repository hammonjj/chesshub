import { Square } from "chess.js";
import { useState } from "react";
import { Chessboard as ReactChessboard } from "react-chessboard";

interface ChessboardProps {
  fen: string;
  isLoading: boolean;
  orientation: "white" | "black";
  onPieceDrop: () => boolean;
}

export default function Chessboard(props: ChessboardProps) {
  const [boardOrientation] = useState<"white" | "black">("white");
  const [arrows, setArrows] = useState<Array<[Square, Square]>>([]);
  console.log("ChessboardProps", props.fen);

  function onPieceDrop(sourceSquare: Square, targetSquare: Square) {
    console.log("onPieceDrop", sourceSquare, targetSquare);

    if (!props.onPieceDrop()) {
      return false;
    }

    setArrows([]);
    playPieceDropAudio();
    return true;
  }

  if (props.isLoading) {
    return <ReactChessboard />;
  }

  return (
    <ReactChessboard
      position={props.fen}
      onPieceDrop={onPieceDrop}
      boardOrientation={boardOrientation}
      customArrows={arrows}
    />
  );
}

function playPieceDropAudio() {
  try {
    const audio = new Audio("/move.mp3");
    audio.play();
  } catch (error) {
    console.error("Error playing audio:", error);
  }
}
