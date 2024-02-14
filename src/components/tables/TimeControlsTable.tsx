import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { Game } from "../../types";
import { useEffect, useState } from "react";
import TimeControlsTableRow from "./TimeControlsTableRow";

interface TimeControlsTableProps {
  games: Game[];
}

export interface AggregatedResult {
  variant: string;
  totalGames: number;
  wins: number;
  draws: number;
  losses: number;
  platforms: PlatformDetail[];
}

interface PlatformDetail {
  platform: string;
  games: number;
  wins: number;
  draws: number;
  losses: number;
}

export default function TimeControlsTable(props: TimeControlsTableProps) {
  const [aggregatedResults, setAggregatedResults] = useState<AggregatedResult[]>([]);

  useEffect(() => {
    setAggregatedResults(aggregateGames(props.games));
  }, [props.games]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible chess table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Variant</TableCell>
            <TableCell align="right">Total Games</TableCell>
            <TableCell align="right">Wins</TableCell>
            <TableCell align="right">Draws</TableCell>
            <TableCell align="right">Losses</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {aggregatedResults.map((result) => (
            <TimeControlsTableRow key={result.variant} row={result} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const aggregateGames = (games: Game[]): AggregatedResult[] => {
  const result: Record<string, AggregatedResult> = {};

  games.forEach((game) => {
    if (!result[game.variant]) {
      result[game.variant] = {
        variant: game.variant,
        totalGames: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        platforms: [],
      };
    }
    const variantResult = result[game.variant];
    variantResult.totalGames++;
    let platformDetail = variantResult.platforms.find(p => p.platform === game.platform);
    const gameResult = game.result.toLowerCase();
    if (gameResult === 'wins') {
      variantResult.wins++;
      platformDetail!.wins++;
    } else if (gameResult === 'draws') {
      variantResult.draws++;
      platformDetail!.draws++;
    } else if (gameResult === 'losses') {
      variantResult.losses++;
      platformDetail!.losses++;
    }

    
    if (!platformDetail) {
      platformDetail = { platform: game.platform, games: 0, wins: 0, draws: 0, losses: 0 };
      variantResult.platforms.push(platformDetail);
    }
    platformDetail.games++;
  });

  return Object.values(result);
};