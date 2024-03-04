import { Card, CardContent, CardHeader, Skeleton } from "@mui/material";
import { Game, Variant } from "../../types";
import { LineChart } from "@mui/x-charts";
import { startOfWeek, isEqual, addWeeks } from "date-fns";

interface EloOverTimeProps {
  games: Game[];
  isLoading: boolean;
  platform: string;
  variant: Variant;
}

export default function EloOverTime(props: EloOverTimeProps) {
  if (props.isLoading) {
    return <Skeleton variant="rectangular" />;
  }

  const uniqueWeeklyGames: Game[] = [];

  const filteredGames = props.games.filter(
    (game) => game.platform === props.platform && game.variant === props.variant
  );
  const sortedGames = filteredGames.sort((a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime());
  let currentWeekStart = sortedGames.length > 0 ? startOfWeek(new Date(sortedGames[0].playedAt)) : new Date();

  sortedGames.forEach((game, index) => {
    const gameWeekStart = startOfWeek(new Date(game.playedAt));
    if (isEqual(gameWeekStart, currentWeekStart) || index === 0) {
      uniqueWeeklyGames.push(game);
      currentWeekStart = addWeeks(currentWeekStart, 1);
    }
  });

  const gameEloData = uniqueWeeklyGames.map((game) => game.playerElo).filter((elo) => elo !== undefined) as number[];
  const ratingRanges = uniqueWeeklyGames.map((game) => game.playedAt);

  return (
    <Card>
      <CardHeader title="Elo Over Time" subheader={props.platform} />
      <CardContent>
        <LineChart
          xAxis={[
            {
              scaleType: "band",
              data: ratingRanges.map((date) => {
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                return `${mm}/${dd}`;
              })
            }
          ]}
          series={[{ data: gameEloData, stack: "A", label: "ELO", color: "red" }]}
          height={300}
        />
      </CardContent>
    </Card>
  );
}
