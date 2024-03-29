import { parseGame } from "@mliebelt/pgn-parser";
import { Game } from "../../types";
import { useEffect, useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
//import SearchIcon from "@mui/icons-material/Search";
import { getWinLossDrawStats } from "../../utils/pgnUtils";
import StatsBar from "../StatsBar";

interface MoveListProps {
  games: Game[];
  moveNumber: number;
  turn: "w" | "b";
  onMoveClick: (move: string) => void;
  onMoveHover: (move: string) => void;
  onMoveHoverLeave: () => void;
}

export default function MoveExplorer({
  games,
  moveNumber,
  turn,
  onMoveClick,
  onMoveHover,
  onMoveHoverLeave
}: MoveListProps) {
  const [gamesByMove, setGamesByMove] = useState<Map<string, Game[]>>(new Map());

  useEffect(() => {
    const tmpGamesByMove = new Map<string, Game[]>();
    for (let i = 0; i < games.length; i++) {
      const parsedGame = parseGame(games[i].pgn);

      let index = parsedGame.moves.findIndex((element) => element.moveNumber === moveNumber);
      if (turn === "b") {
        index++;
      }

      if (parsedGame.moves.length < index) {
        continue;
      }

      if (tmpGamesByMove.has(parsedGame.moves[index].notation.notation)) {
        tmpGamesByMove.get(parsedGame.moves[index].notation.notation)?.push(games[i]);
      } else {
        tmpGamesByMove.set(parsedGame.moves[index].notation.notation, [games[i]]);
      }
    }

    setGamesByMove(tmpGamesByMove);
  }, [games, moveNumber, turn]);

  const handleRowClick = (move: string) => {
    onMoveClick(move);
  };

  const sortedMoves = Array.from(gamesByMove.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map((entry) => entry[0]);

  return (
    <div>
      <Paper style={{ marginBottom: "10px" }}>
        <div>Games with this PGN: {games.length}</div>
        <StatsBar
          stats={
            games.length > 0 ? getWinLossDrawStats(games, games[0].pieces) : { wins: 0, losses: 0, draws: 0, total: 1 }
          }
          exclude={9.99}
        />
      </Paper>
      {games.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible chess table" size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: "nowrap", width: "1%" }}>Move</TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap", width: "1%" }}>
                  Games
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap", width: "1%" }}>
                  %
                </TableCell>
                <TableCell align="right">Result</TableCell>
                {/* <TableCell align="right">
                  <SearchIcon />
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedMoves.map((move, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => handleRowClick(move)}
                  sx={{
                    "& > *": { borderBottom: "unset" },
                    "&:hover": { cursor: "pointer" }
                  }}
                  onMouseEnter={() => onMoveHover(move)}
                  onMouseLeave={onMoveHoverLeave}
                >
                  <TableCell component="th" scope="row" sx={{ whiteSpace: "nowrap" }}>
                    {move}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {gamesByMove.get(move)?.length}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {(+(gamesByMove.get(move)!.length / games.length) * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    <StatsBar stats={getWinLossDrawStats(gamesByMove.get(move)!, games[0].pieces)} exclude={14.99} />
                  </TableCell>
                  {/* <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    <SearchIcon />
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
