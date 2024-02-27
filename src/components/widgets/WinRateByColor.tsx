import { Card, CardContent, CardHeader, Skeleton } from "@mui/material";
import { Game } from "../../types";
import { BarChart } from "@mui/x-charts";

interface WinRateByColorProps {
  games: Game[];
  isLoading: boolean;
}

export default function WinRateByColor(props: WinRateByColorProps) {
  if (props.isLoading) {
    return (
      <Card>
        <CardHeader title="Results By Color" />
        <CardContent>
          <Skeleton variant="rectangular" width="100%" height={118} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="60%" />
        </CardContent>
      </Card>
    );
  }

  const whiteGames = props.games.filter((game) => game.pieces === "White");
  const blackGames = props.games.filter((game) => game.pieces === "Black");

  //Convert to percents
  const whiteLosses = whiteGames.filter((game) => {
    return game.result === "Loss";
  }).length;

  const blackLosses = blackGames.filter((game) => {
    return game.result === "Loss";
  }).length;

  const whiteDraws = whiteGames.filter((game) => {
    return game.result === "Draw";
  }).length;

  const blackDraws = blackGames.filter((game) => {
    return game.result === "Draw";
  }).length;

  const whiteWins = whiteGames.filter((game) => {
    return game.result === "Win";
  }).length;

  const blackWins = blackGames.filter((game) => {
    return game.result === "Win";
  }).length;

  return (
    <Card>
      <CardHeader title="Results By Color" />
      <CardContent>
        <BarChart
          xAxis={[{ scaleType: "band", data: ["White", "Black"] }]}
          series={[
            {
              data: [whiteLosses, blackLosses],
              stack: "A",
              label: "Losses",
              color: "red"
              //valueFormatter: (value) => value + `%`
            },
            {
              data: [whiteDraws, blackDraws],
              stack: "A",
              label: "Draws",
              color: "gray"
              //valueFormatter: (value) => value + `%`
            },
            {
              data: [whiteWins, blackWins],
              stack: "A",
              label: "Wins",
              color: "green"
              //valueFormatter: (value) => value + `%`
            }
          ]}
          height={300}
        />
      </CardContent>
    </Card>
  );
}
