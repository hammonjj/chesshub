import { Box, Grid, Paper } from "@mui/material";
import ResultsByOpponentRating from "../components/widgets/ResultsByOpponentRating";
import useGames from "../hooks/useGames";
import { useReducer } from "react";
import InsightsFilters from "../components/filters/InsightsFilters";
import { applyDateFilter } from "../utils/pgnUtils";
import WinRateByColor from "../components/widgets/WinRateByColor";
import ResultByGamePhase from "../components/widgets/ResultsByGamePhase";

export interface InsightsFilterState {
  date: string;
  variant: "All" | "Bullet" | "Rapid" | "Blitz" | "Classical";
}

export type InsightsFilterAction =
  | { type: "SET_DATE"; payload: string }
  | {
      type: "SET_VARIANT";
      payload: "All" | "Bullet" | "Rapid" | "Blitz" | "Classical";
    };

const initialState: InsightsFilterState = {
  date: "all-time",
  variant: "All"
};

const filterReducer = (state: InsightsFilterState, action: InsightsFilterAction) => {
  switch (action.type) {
    case "SET_DATE":
      return { ...state, date: action.payload };
    case "SET_VARIANT":
      return { ...state, variant: action.payload };
    default:
      return state;
  }
};

export default function Insights() {
  const { games, isLoadingGames } = useGames();
  const [state, dispatch] = useReducer(filterReducer, initialState);

  const filteredGames = games.filter((game) => {
    if (!applyDateFilter(game, state.date)) {
      return false;
    }

    if (state.variant !== "All" && game.variant !== state.variant) {
      return false;
    }

    return true;
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Paper elevation={1} sx={{ p: 2 }}>
        <InsightsFilters state={state} dispatch={dispatch} />
      </Paper>
      <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} md={6}>
            <WinRateByColor games={filteredGames} isLoading={isLoadingGames} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ResultByGamePhase games={filteredGames} isLoading={isLoadingGames} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ResultsByOpponentRating
              games={filteredGames.filter((game) => game.platform === "chess.com")}
              isLoading={isLoadingGames}
              platform="chess.com"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ResultsByOpponentRating
              games={filteredGames.filter((game) => game.platform === "lichess")}
              isLoading={isLoadingGames}
              platform="lichess"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
