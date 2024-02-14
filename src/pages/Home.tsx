import TimeControlsTable from "../components/tables/TimeControlsTable";

export default function Home() {

  return (
    <div style={{marginBottom: "5rem"}}>
      <h1>Home</h1>

      <div>Time Controls</div>
      <TimeControlsTable games={[]} />

      <div>Latest Games</div>
      {/* Latest Games */}
    </div>
  );
}