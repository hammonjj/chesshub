import { parseGame } from "@mliebelt/pgn-parser";
import { Game } from "../../types";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card, CardContent, CardHeader, Skeleton } from "@mui/material";

interface ResultsByOpponentRatingProps {
  games: Game[];
  isLoading: boolean;
  platform: string;
}

export default function ResultsByOpponentRating(props: ResultsByOpponentRatingProps) {
  const wins: { ratingRange: number; games: number }[] = [];
  const losses: { ratingRange: number; games: number }[] = [];
  const draws: { ratingRange: number; games: number }[] = [];
  const ratingRanges: number[] = [];

  props.games.forEach((game) => {
    const parsedGame = parseGame(game.pgn);
    const opponentElo = game.pieces === "White" ? parsedGame.tags?.BlackElo : parsedGame.tags?.WhiteElo;

    if (!opponentElo || opponentElo === "?") {
      return;
    }

    const ratingRange = Math.floor(+opponentElo / 100) * 100;
    if (!ratingRanges.includes(ratingRange)) {
      ratingRanges.push(ratingRange);
    }

    const resultArray = game.result === "Win" ? wins : game.result === "Loss" ? losses : draws;
    const resultEntry = resultArray.find((entry) => entry.ratingRange === ratingRange);
    if (resultEntry) {
      resultEntry.games++;
    } else {
      resultArray.push({ ratingRange, games: 1 });
    }
  });

  if (props.isLoading) {
    return (
      <Card>
        <CardHeader title="Results By Opponent Rating" />
        <CardContent>
          <Skeleton variant="rectangular" width="100%" height={300} />
        </CardContent>
      </Card>
    );
  }

  ratingRanges.sort((a, b) => a - b);

  const lossesData = losses.map((loss) => loss.games);
  const winsData = wins.sort((a, b) => a.ratingRange - b.ratingRange).map((win) => win.games);
  const drawsData = draws.sort((a, b) => a.ratingRange - b.ratingRange).map((draw) => draw.games);

  return (
    <Card>
      <CardHeader title="Results By Opponent Rating" subheader={props.platform} />
      <CardContent>
        <BarChart
          xAxis={[{ scaleType: "band", data: ratingRanges }]}
          series={[
            { data: lossesData, stack: "A", label: "Losses", color: "red" },
            { data: drawsData, stack: "A", label: "Draws", color: "gray" },
            { data: winsData, stack: "A", label: "Wins", color: "green" }
          ]}
          height={300}
        />
      </CardContent>
    </Card>
  );
}
