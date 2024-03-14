import { useEffect, useState, useRef } from "react";
import { parseGame } from "@mliebelt/pgn-parser";
import { Game } from "../../types";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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

//Experimenting with some performance enhancements of the MoveExplorer
export default function MoveExplorer_v2({
  games,
  moveNumber,
  turn,
  onMoveClick,
  onMoveHover,
  onMoveHoverLeave
}: MoveListProps) {
  const [gamesByMove, setGamesByMove] = useState<Map<string, Game[]>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsedGamesCache = useRef<Map<string, any>>(new Map());
  const movesCache = useRef<Map<string, Map<string, Game[]>>>(new Map());

  useEffect(() => {
    const cacheKey = `${moveNumber}-${turn}`;
    if (movesCache.current.has(cacheKey)) {
      setGamesByMove(movesCache.current.get(cacheKey)!);
      return;
    }

    const tmpGamesByMove = new Map<string, Game[]>();
    games.forEach((game) => {
      if (!game.id) return; // Ensure each game has an ID
      let parsedGame;

      if (parsedGamesCache.current.has(game.id.toString())) {
        parsedGame = parsedGamesCache.current.get(game.id.toString());
      } else {
        parsedGame = parseGame(game.pgn);
        parsedGamesCache.current.set(game.id.toString(), parsedGame);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let index = parsedGame.moves.findIndex((element: any) => element.moveNumber === moveNumber);
      if (turn === "b") {
        index++;
      }

      if (index < 0 || index >= parsedGame.moves.length) {
        return;
      }

      const moveNotation = parsedGame.moves[index].notation.notation;
      if (tmpGamesByMove.has(moveNotation)) {
        tmpGamesByMove.get(moveNotation)?.push(game);
      } else {
        tmpGamesByMove.set(moveNotation, [game]);
      }
    });

    movesCache.current.set(cacheKey, tmpGamesByMove);
    setGamesByMove(tmpGamesByMove);
  }, [games, moveNumber, turn]);

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
                <TableCell align="right">
                  <SearchIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedMoves.map((move, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => handleRowClick(move)}
                  onMouseEnter={() => onMoveHover(move)}
                  onMouseLeave={onMoveHoverLeave}
                  sx={{ "& > *": { borderBottom: "unset" }, "&:hover": { cursor: "pointer" } }}
                >
                  <TableCell component="th" scope="row" sx={{ whiteSpace: "nowrap" }}>
                    {move}
                  </TableCell>
                  <TableCell align="right">{gamesByMove.get(move)?.length}</TableCell>
                  <TableCell align="right">
                    {(+(gamesByMove.get(move)!.length / games.length) * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell align="right">
                    <StatsBar stats={getWinLossDrawStats(gamesByMove.get(move)!, games[0].pieces)} exclude={14.99} />
                  </TableCell>
                  <TableCell align="right">
                    <SearchIcon />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );

  function handleRowClick(move: string) {
    onMoveClick(move);
  }
}
