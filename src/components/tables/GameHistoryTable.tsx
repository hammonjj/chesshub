import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton, TablePagination } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import useGames from "../../hooks/useGames";
import { useState } from "react";

interface GameHistoryTableProps {
  //Add Filters
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function GameHistoryTable(_props: GameHistoryTableProps) {
  const { games, isLoadingGames } = useGames();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when changing rows per page
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, games.length - page * rowsPerPage);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible chess table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Pieces</TableCell>
            <TableCell align="right">Result</TableCell>
            <TableCell align="right">Moves</TableCell>
            <TableCell align="right">Variant</TableCell>
            <TableCell align="right">Time Control</TableCell>
            <TableCell align="right">Platform</TableCell>
            <TableCell align="right">Opening</TableCell>
            <TableCell align="right">URL</TableCell>
          </TableRow>
        </TableHead>
        {isLoadingGames ? renderSkeleton() : (
          <TableBody>
            {(rowsPerPage > 0
              ? games.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : games
            ).map((game) => (
              <TableRow key={game.id} sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row">{`${game.playedAt.getMonth()+1}/${game.playedAt.getDate()}`}</TableCell>
                <TableCell align="right">{game.pieces}</TableCell>
                <TableCell align="right">{game.result}</TableCell>
                <TableCell align="right">{game.moves}</TableCell>
                <TableCell align="right">{game.variant}</TableCell>
                <TableCell align="right">{game.timeControl}</TableCell>
                <TableCell align="right">{game.platform}</TableCell>
                <TableCell align="right">{game.eco}</TableCell>
                <TableCell align="right">
                  <a href={game.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <OpenInNewIcon style={{ color: 'currentColor' }}/>
                  </a>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={10} />
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={games.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

const renderSkeleton = () => (
  <TableBody>
    {[...new Array(10)].map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
      </TableRow>
    ))}
  </TableBody>
);