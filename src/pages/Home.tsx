import { Grid } from "@mui/material";
import EloTable from "../components/tables/EloTable";
import GameHistoryTable from "../components/tables/GameHistoryTable";
import TimeControlsTable from "../components/tables/TimeControlsTable";

export default function Home() {
  return (
    <div style={{marginBottom: "5rem", overflow: "hidden"}}>
      <h1>Home</h1>
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
    </div>
  );
}