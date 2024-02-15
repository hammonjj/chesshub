import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton } from "@mui/material";
import { Game } from "../../types";
import { useEffect, useState } from "react";
import TimeControlsTableRow from "./TimeControlsTableRow";
import useGames from "../../hooks/useGames";

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

export default function TimeControlsTable() {
  const { games, isLoadingGames } = useGames();
  const [aggregatedResults, setAggregatedResults] = useState<AggregatedResult[]>([]);

  useEffect(() => {
    if(games.length === 0) {
      return;
    }

    setAggregatedResults(aggregateGames(games));
  }, [games]);

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
            <TableCell align="right">W/D/L</TableCell>
          </TableRow>
        </TableHead>
        {isLoadingGames ? renderSkeleton() : (
          <TableBody>
            {aggregatedResults.map((result) => (
              <TimeControlsTableRow key={result.variant} row={result} />
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}

const aggregateGames = (games: Game[]): AggregatedResult[] => {
  const result: Record<string, AggregatedResult> = {};

  games.forEach((game) => {
    const variantKey = game.variant;
    if (!result[variantKey]) {
      result[variantKey] = {
        variant: game.variant,
        totalGames: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        platforms: [],
      };
    }

    const variantResult = result[variantKey];
    variantResult.totalGames++;

    // Initialize or update platform detail
    let platformDetail = variantResult.platforms.find(p => p.platform === game.platform);
    if (!platformDetail) {
      platformDetail = { platform: game.platform, games: 0, wins: 0, draws: 0, losses: 0 };
      variantResult.platforms.push(platformDetail);
    }
    platformDetail.games++;

    // Increment wins, draws, or losses
    const gameResult = game.result.toLowerCase();
    if (gameResult === 'win') {
      variantResult.wins++;
      platformDetail.wins++;
    } else if (gameResult === 'draw') {
      variantResult.draws++;
      platformDetail.draws++;
    } else if (gameResult === 'loss') {
      variantResult.losses++;
      platformDetail.losses++;
    }
  });

  return Object.values(result);
};

const renderSkeleton = () => (
  <TableBody>
    {[...new Array(5)].map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
      </TableRow>
    ))}
  </TableBody>
);