import TimeControlsTable from "../components/tables/TimeControlsTable";
import useGames from "../hooks/useGames";

export default function Home() {
  const { syncExternalAccountsToLocalDb } = useGames();

  async function  handleRefetchClick() {
    console.log("Refetching");
    await syncExternalAccountsToLocalDb();
  }

  return (
    <div style={{marginBottom: "5rem"}}>
      <h1>Home</h1>
      <button onClick={handleRefetchClick}>Refetch</button>
      <div>Time Controls</div>
      <TimeControlsTable />

      <div>Latest Games</div>
      {/* Latest Games */}
    </div>
  );
}