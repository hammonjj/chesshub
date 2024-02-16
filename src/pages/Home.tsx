import EloTable from "../components/tables/EloTable";
import GameHistoryTable from "../components/tables/GameHistoryTable";
import TimeControlsTable from "../components/tables/TimeControlsTable";

export default function Home() {
  return (
    <div style={{marginBottom: "5rem", overflow: "hidden"}}>
      <h1>Home</h1>
      <div style={{ display: "flex", flexDirection: "row", marginBottom: "40px", width: '100%' }}>
        <div style={{ flex: '8 1 0%', maxWidth: '73%', marginRight: "15px" }}> {/* Adjusted for spacing between tables */}
          <TimeControlsTable />
        </div>
        <div style={{ flex: '2 1 0%', maxWidth: '27%' }}> {/* Prevents growing beyond 20% */}
          <EloTable />
        </div>
      </div>

      <GameHistoryTable />
    </div>
  );
}