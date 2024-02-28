import { Table, TableBody, TableContainer, Paper, TableCell, TableRow } from "@mui/material";
import { MoveEvaluation } from "../../types";

interface AnalysisTableProps {
  fen: string;
  evaluations: MoveEvaluation[];
}

export default function AnalysisTable({ evaluations, fen }: AnalysisTableProps) {
  const filledEvaluations = [...evaluations];
  while (filledEvaluations.length < 4) {
    filledEvaluations.push({} as MoveEvaluation);
  }

  const sortedEvaluations = filledEvaluations.sort((a, b) => b.multipv - a.multipv);
  return (
    <TableContainer component={Paper} style={{ backgroundColor: "#333", color: "white", overflowX: "auto" }}>
      <Table aria-label="analysis table" size="small" style={{ tableLayout: "fixed", width: "100%" }}>
        <TableBody>
          <TableRow style={{ borderBottom: "1px solid #555" }}>
            <TableCell
              component="th"
              scope="row"
              style={{
                color: "#6df",
                width: "20%",
                maxWidth: "15%"
              }}
            >
              FEN
            </TableCell>
            <TableCell
              style={{
                color: "white",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {fen}
            </TableCell>
          </TableRow>
          {sortedEvaluations.map((evaluation, index) => (
            <TableRow style={{ borderBottom: "1px solid #555" }} key={index}>
              <TableCell
                component="th"
                scope="row"
                style={{
                  color: "#6df",
                  width: "20%",
                  maxWidth: "15%",
                  height: "33px"
                }}
              >
                {evaluation.score ? evaluation.score.toFixed(2) : ""}
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  height: "33px"
                }}
              >
                {evaluation.move || ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
