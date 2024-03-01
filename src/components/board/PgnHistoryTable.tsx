import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { BoardMove } from "../../types";

interface PgnHistoryTableProps {
  moveNumber: number;
  moves: BoardMove[];
  turn: "w" | "b";
}

export default function PgnHistoryTable({ moveNumber, turn, moves }: PgnHistoryTableProps) {
  return (
    <TableContainer component={Paper} style={{ backgroundColor: "#333", color: "white" }}>
      <Table aria-label="pgn table" size="small">
        <TableBody>
          {moves.map((move, index) => {
            if (index % 2 !== 0) {
              //Iterate through moves as pairs
              return null;
            }

            return (
              <TableRow key={index}>
                <TableCell
                  style={{
                    color: "white",
                    padding: "6px 16px",
                    backgroundColor: index + 1 === moveNumber && turn === "b" ? "#BDB76B" : "#333"
                  }}
                >
                  {move.notation}
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    padding: "6px 16px",
                    backgroundColor: index + 2 === moveNumber && turn === "w" ? "#BDB76B" : "#333"
                  }}
                >
                  {moves.length > index + 1 ? moves[index + 1].notation : ""}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
