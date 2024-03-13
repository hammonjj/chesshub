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
  const [customStyles, setCustomStyles] = useState<{ [key: string]: React.CSSProperties }>({});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onPieceDrop(_sourceSquare: Square, _targetSquare: Square) {
    if (!props.onPieceDrop()) {
      return false;
    }

    setArrows([]);
    setCustomStyles({});
    playPieceDropAudio();
    return true;
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

  if (props.isLoading) {
    return <ReactChessboard />;
  }

  return (
    <ReactChessboard
      position={props.fen}
      onPieceDrop={onPieceDrop}
      boardOrientation={boardOrientation}
      customArrows={arrows}
      onSquareClick={onSquareLeftClick}
      onSquareRightClick={onSquareRightClick}
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
