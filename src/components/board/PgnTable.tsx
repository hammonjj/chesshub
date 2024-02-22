import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

interface MovePair {
  white: string;
  black: string;
}

interface PGNTableProps {
  moves: MovePair[];
}

export default function PGNTable({ moves }: PGNTableProps) {
  return (
    <TableContainer component={Paper} style={{ backgroundColor: '#333', color: 'white' }}>
      <Table aria-label="pgn table" size="small">
        <TableBody>
          {moves.map((movePair, index) => (
            <TableRow key={index} style={{ borderBottom: '1px solid #555' }}>
              <TableCell style={{ color: 'white', borderRight: '1px solid #555', width: '10%' }}>
                {index + 1}.
              </TableCell>
              <TableCell style={{ color: 'white', padding: '6px 16px' }}>
                {movePair.white}
              </TableCell>
              <TableCell style={{ color: 'white', padding: '6px 16px' }}>
                {movePair.black}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}