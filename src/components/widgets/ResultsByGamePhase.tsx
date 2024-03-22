import { Card, CardContent, CardHeader, Skeleton } from "@mui/material";
import { Game } from "../../types";
import { BarChart } from "@mui/x-charts";

interface ResultByGamePhaseProps {
  games: Game[];
  isLoading: boolean;
}

export default function ResultByGamePhase(props: ResultByGamePhaseProps) {
  if (props.isLoading) {
    return (
      <Card>
        <CardHeader title="Results By Game Phase" />
        <CardContent>
          <Skeleton variant="rectangular" width="100%" height={300} />
        </CardContent>
      </Card>
    );
  }

  const gamesWithMetadata = props.games.filter((game) => game.metadata);

  const wonGames = gamesWithMetadata.filter((game) => game.result === "Win");
  const lostGames = gamesWithMetadata.filter((game) => game.result === "Loss");
  const drawnGames = gamesWithMetadata.filter((game) => game.result === "Draw");

  const openingWins = wonGames.filter((game) => game.metadata?.endingPhase === "opening").length;
  const middlegameWins = wonGames.filter((game) => game.metadata?.endingPhase === "middlegame").length;
  const endgameWins = wonGames.filter((game) => game.metadata?.endingPhase === "endgame").length;

  const openingLosses = lostGames.filter((game) => game.metadata?.endingPhase === "opening").length;
  const middlegameLosses = lostGames.filter((game) => game.metadata?.endingPhase === "middlegame").length;
  const endgameLosses = lostGames.filter((game) => game.metadata?.endingPhase === "endgame").length;

  const openingDraws = drawnGames.filter((game) => game.metadata?.endingPhase === "opening").length;
  const middlegameDraws = drawnGames.filter((game) => game.metadata?.endingPhase === "middlegame").length;
  const endgameDraws = drawnGames.filter((game) => game.metadata?.endingPhase === "endgame").length;

  return (
    <Card>
      <CardHeader title="Results By Game Phase" />
      <CardContent>
        <BarChart
          xAxis={[{ scaleType: "band", data: ["Opening", "Middlegame", "Endgame"] }]}
          series={[
            {
              data: [openingLosses, middlegameLosses, endgameLosses],
              stack: "A",
              label: "Losses",
              color: "red"
            },
            {
              data: [openingDraws, middlegameDraws, endgameDraws],
              stack: "A",
              label: "Draws",
              color: "gray"
            },
            {
              data: [openingWins, middlegameWins, endgameWins],
              stack: "A",
              label: "Wins",
              color: "green"
            }
          ]}
          height={300}
        />
      </CardContent>
    </Card>
  );
}
