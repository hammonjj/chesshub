import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";

interface PgnHistoryTableProps {
  moveNumber: number;
  moves: string[];
  turn: "w" | "b";
}

export default function PgnHistoryTable({ moveNumber, moves, turn }: PgnHistoryTableProps) {
  console.log("PgnHistoryTableProps", moveNumber, turn, moves);
  return (
    <TableContainer component={Paper} style={{ backgroundColor: "#333", color: "white" }}>
      <Table aria-label="pgn table" size="small">
        <TableBody>
          {moves.map((move, index) => {
            if (index % 2 !== 0) {
              return null;
            }

            console.log("index", index);
            console.log("moveNumber", moveNumber);
            console.log("turn", turn);
            return (
              <TableRow key={index}>
                <TableCell style={{ color: "white", width: "10%", border: "1px solid #555" }}>{index + 1}</TableCell>
                <TableCell
                  style={{
                    color: "white",
                    padding: "6px 16px",
                    backgroundColor: index + 1 === moveNumber && turn === "b" ? "#BDB76B" : "#333"
                  }}
                >
                  {move}
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    padding: "6px 16px",
                    backgroundColor: index + 2 === moveNumber && turn === "w" ? "#BDB76B" : "#333"
                  }}
                >
                  {moves.length >= index ? moves[index + 1] : ""}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
