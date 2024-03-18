import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  useMediaQuery
} from "@mui/material";
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
  const isMobile = useMediaQuery("(max-width:600px)");
  const [aggregatedResults, setAggregatedResults] = useState<AggregatedResult[]>([]);

  useEffect(() => {
    if (games.length === 0) {
      return;
    }

    setAggregatedResults(aggregateGames(games));
  }, [games]);

  return (
    <TableContainer component={Paper} className="tableWrapper">
      <Table aria-label="collapsible chess table" className="tableFixed" size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ whiteSpace: "nowrap", width: "5%" }} />
            <TableCell sx={{ whiteSpace: "nowrap", width: "10%" }}>Variant</TableCell>
            <TableCell align="right" sx={{ whiteSpace: "nowrap", width: "10%" }}>
              Games
            </TableCell>
            {!isMobile && (
              <>
                <TableCell align="right" sx={{ whiteSpace: "nowrap", width: "10%" }}>
                  W
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap", width: "10%" }}>
                  D
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap", width: "10%" }}>
                  L
                </TableCell>
              </>
            )}
            <TableCell align="center">W/D/L</TableCell>
          </TableRow>
        </TableHead>
        {isLoadingGames ? (
          renderSkeleton()
        ) : (
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
        platforms: []
      };
    }

    const variantResult = result[variantKey];
    variantResult.totalGames++;

    // Initialize or update platform detail
    let platformDetail = variantResult.platforms.find((p) => p.platform === game.platform);
    if (!platformDetail) {
      platformDetail = { platform: game.platform, games: 0, wins: 0, draws: 0, losses: 0 };
      variantResult.platforms.push(platformDetail);
    }
    platformDetail.games++;

    // Increment wins, draws, or losses
    const gameResult = game.result.toLowerCase();
    if (gameResult === "win") {
      variantResult.wins++;
      platformDetail.wins++;
    } else if (gameResult === "draw") {
      variantResult.draws++;
      platformDetail.draws++;
    } else if (gameResult === "loss") {
      variantResult.losses++;
      platformDetail.losses++;
    }
  });

  return Object.values(result);
};

const renderSkeleton = () => (
  <TableBody>
    {[...new Array(3)].map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell align="right">
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell align="right">
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell align="right">
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell align="right">
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell align="right">
          <Skeleton animation="wave" />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
);
