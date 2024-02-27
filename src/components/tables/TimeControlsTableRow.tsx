import { useState } from "react";
import { AggregatedResult } from "./TimeControlsTable";
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, useMediaQuery } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import StatsBar from "../StatsBar";

interface TimeControlsTableRow {
  row: AggregatedResult;
}

const TimeControlsTableRow: React.FC<TimeControlsTableRow> = ({ row }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const padding = "16px";
  
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{row.variant}</TableCell>
        <TableCell align="right" style={{ padding: padding }}>{row.totalGames}</TableCell>
        {!isMobile && (
          <>
            <TableCell align="right" style={{ padding: padding }}>{row.wins}</TableCell>
            <TableCell align="right" style={{ padding: padding }}>{row.draws}</TableCell>
            <TableCell align="right" style={{ padding: padding }}>{row.losses}</TableCell>
          </>)}
        <TableCell>
          <StatsBar stats={{ 
            wins: row.wins, 
            losses: row.losses, 
            draws: row.draws, 
            total: row.totalGames }} 
            exclude={0}/>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Platform Details
              </Typography>
              <Table size="small" aria-label="platform details">
                <TableHead>
                  <TableRow>
                    <TableCell>Platform</TableCell>
                    <TableCell align="right">Games</TableCell>
                    <TableCell align="right">Wins</TableCell>
                    <TableCell align="right">Draws</TableCell>
                    <TableCell align="right">Losses</TableCell>
                    <TableCell align="right">W/D/L</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.platforms.map((platformDetail) => (
                    <TableRow key={platformDetail.platform}>
                      <TableCell component="th" scope="row">{platformDetail.platform}</TableCell>
                      <TableCell align="right">{platformDetail.games}</TableCell>
                      <TableCell align="right">{platformDetail.wins}</TableCell>
                      <TableCell align="right">{platformDetail.draws}</TableCell>
                      <TableCell align="right">{platformDetail.losses}</TableCell>
                      <TableCell align="right">{`${Math.floor((platformDetail.wins/platformDetail.games)*100)}%/${Math.floor((platformDetail.draws/platformDetail.games)*100)}%/${Math.floor((platformDetail.losses/platformDetail.games)*100)}%`}</TableCell>
                      {/* <TableCell>
                        <StatsBar stats={{ 
                          wins: platformDetail.wins, 
                          losses: platformDetail.losses, 
                          draws: platformDetail.draws, 
                          total: platformDetail.games 
                          }} 
                          exclude={0}/>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TimeControlsTableRow;