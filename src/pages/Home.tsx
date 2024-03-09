import { Grid } from "@mui/material";
import EloTable from "../components/tables/EloTable";
import GameHistoryTable from "../components/tables/GameHistoryTable";
import TimeControlsTable from "../components/tables/TimeControlsTable";
import EloOverTime from "../components/widgets/EloOverTime";
import useGames from "../hooks/useGames";
import EloTrend from "../components/widgets/EloTrend";

export default function Home() {
  const { games, isLoadingGames } = useGames();
  return (
    <div style={{ marginBottom: "5rem", overflow: "hidden" }}>
      <h1>Home</h1>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <EloTrend games={games} isLoading={isLoadingGames} variant="Rapid" />
            </Grid>
            <Grid item xs={12} md={6}>
              <EloOverTime games={games} isLoading={isLoadingGames} platform="lichess" variant="Rapid" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TimeControlsTable />
            </Grid>
            <Grid item xs={12} md={4}>
              <EloTable />
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
