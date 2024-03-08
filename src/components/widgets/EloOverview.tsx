import { Card, CardContent, CardHeader, Skeleton, Typography, Grid } from "@mui/material";
import { Game, Variant } from "../../types";
import useChessDotComPlayerStats from "../../hooks/useChessDotComPlayerStats";
import useLichessPlayerStats from "../../hooks/useLichessPlayerStats";

interface EloOverviewProps {
  games: Game[];
  variant: Variant;
  isLoading: boolean;
}

export default function EloOverview(props: EloOverviewProps) {
  const { data: chessDotComData, isLoading: chessDotComIsLoading } = useChessDotComPlayerStats();
  const { data: lichessData, isLoading: lichessIsLoading } = useLichessPlayerStats();

  const currentRatingChessDotCom = chessDotComData?.chessRapid?.last.rating;
  const currentRatingLichess = lichessData?.perfs.rapid.rating;

  const calculateRatingChange = (dateSubtractFunction: (date: Date) => void, platform: string) => {
    const date = new Date();
    dateSubtractFunction(date);
    return props.games
      .filter((game) => game.platform === platform)
      .find((game) => game.variant === props.variant && new Date(game.playedAt) < date)?.playerElo;
  };

  const ratingChanges = [
    {
      period: "Last 7 Days",
      chessDotComRating: calculateRatingChange((d) => d.setDate(d.getDate() - 7), "chess.com"),
      lichessRating: calculateRatingChange((d) => d.setDate(d.getDate() - 7), "lichess")
    },
    {
      period: "Last 30 Days",
      chessDotComRating: calculateRatingChange((d) => d.setMonth(d.getMonth() - 1), "chess.com"),
      lichessRating: calculateRatingChange((d) => d.setMonth(d.getMonth() - 1), "lichess")
    },
    {
      period: "Last 90 Days",
      chessDotComRating: calculateRatingChange((d) => d.setMonth(d.getMonth() - 3), "chess.com"),
      lichessRating: calculateRatingChange((d) => d.setMonth(d.getMonth() - 3), "lichess")
    }
  ];

  if (props.isLoading || chessDotComIsLoading || lichessIsLoading) {
    return (
      <Card>
        <CardHeader title="ELO Changes" />
        <CardContent>
          <Skeleton variant="rectangular" width="100%" height={118} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="60%" />
        </CardContent>
      </Card>
    );
  }

  const eloChangeRow = (currentRating: number, period: string, ratingChange: number | undefined) => {
    const change = ratingChange ? currentRating - ratingChange : 0;
    return (
      <Typography variant="body1" component="div" sx={{ color: change >= 0 ? "green" : "red", textAlign: "left" }}>
        {period}: {currentRating} ({change >= 0 ? "+" : ""}
        {change}) {change >= 0 ? "↑" : "↓"}
      </Typography>
    );
  };

  return (
    <Card>
      <CardHeader title="ELO Changes" subheader="lichess & chess.com" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6} container direction="column" spacing={2}>
            <Typography variant="h6">Chess.com</Typography>
            {ratingChanges.map(({ period, chessDotComRating }) => (
              <Grid item key={period}>
                {eloChangeRow(currentRatingChessDotCom!, period, chessDotComRating)}
              </Grid>
            ))}
          </Grid>
          <Grid item xs={6} container direction="column" spacing={2}>
            <Typography variant="h6">Lichess</Typography>
            {ratingChanges.map(({ period, lichessRating }) => (
              <Grid item key={`${period}-lichess`}>
                {eloChangeRow(currentRatingLichess!, period, lichessRating)}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
