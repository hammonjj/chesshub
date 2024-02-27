import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

interface PgnTableProps {
  moves: string[][];
}

export default function PgnTable({ moves }: PgnTableProps) {
  return (
    <TableContainer component={Paper} style={{ backgroundColor: '#333', color: 'white' }}>
      <Table aria-label="pgn table" size="small">
        <TableBody>
          {moves.map((movePair, index) => (
            <TableRow key={index}>
              <TableCell style={{ color: 'white', width: '10%', border: '1px solid #555'  }}>
                {index + 1}
              </TableCell>
              <TableCell style={{ color: 'white', padding: '6px 16px'}}>
                {movePair[0]}
              </TableCell>
              <TableCell style={{ color: 'white', padding: '6px 16px' }}>
                {movePair.length > 1 ? movePair[1] : ''}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}