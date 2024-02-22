import { Table, TableBody, TableContainer, Paper, TableCell, TableRow } from '@mui/material';
import { MoveEvaluation } from '../../types';

interface AnalysisTableProps {
  evaluations: MoveEvaluation[];
}

export default function AnalysisTable({ evaluations }: AnalysisTableProps) {
  const sortedEvaluations = evaluations.sort((a, b) => b.multipv - a.multipv);

  return (
    <TableContainer component={Paper} style={{ backgroundColor: '#333', color: 'white', overflowX: 'auto' }}>
      <Table aria-label="analysis table" size="small" style={{ tableLayout: 'fixed', width: '100%' }}>
        <TableBody>
          {sortedEvaluations.map((evaluation, index) => (
            <TableRow style={{ borderBottom: '1px solid #555' }} key={index}>
              <TableCell component="th" scope="row" style={{ 
                color: '#6df', 
                width: '20%', 
                maxWidth: '15%' 
              }}>
                {evaluation.score.toFixed(2)}
              </TableCell>
              <TableCell style={{ 
                color: 'white', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
              }}>
                {evaluation.move}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}