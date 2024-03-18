import { Grid } from "@mui/material";
import GameHistoryTable from "../components/tables/GameHistoryTable";
import TimeControlsTable from "../components/tables/TimeControlsTable";
import useGames from "../hooks/useGames";
import EloChangeSummary from "../components/widgets/EloChangeSummary";

export default function Dashboard() {
  const { games, isLoadingGames } = useGames();

  return (
    <div style={{ marginBottom: "5rem", overflow: "hidden" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <EloChangeSummary games={games} isLoading={isLoadingGames} variant="Blitz" />
            </Grid>
            <Grid item xs={12} md={6}>
              <EloChangeSummary games={games} isLoading={isLoadingGames} variant="Rapid" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TimeControlsTable />
            </Grid>
            <Grid item xs={12}>
              <GameHistoryTable />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
