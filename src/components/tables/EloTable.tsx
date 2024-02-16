import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import useChessDotComPlayerStats from "../../hooks/useChessDotComPlayerStats";
import useGames from "../../hooks/useGames";
import useLichessPlayerStats from "../../hooks/useLichessPlayerStats";

interface EloTableProps {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function EloTable(_props: EloTableProps) {
  const { isLoadingGames } = useGames();
  const { data: chessDotComData, isLoading: chessDotComIsLoading } = useChessDotComPlayerStats();
  const { data: lichessData, isLoading: lichessIsLoading } = useLichessPlayerStats();

  return (
   <TableContainer component={Paper} className="tableWrapper">
      <Table aria-label="collapsible elo table" className="tableFixed">
        <TableHead>
          <TableRow>
            <TableCell>Platform</TableCell>
            <TableCell align="right">Bullet</TableCell>
            <TableCell align="right">Blitz</TableCell>
            <TableCell align="right">Rapid</TableCell>
          </TableRow>
        </TableHead>
        {chessDotComIsLoading || isLoadingGames || lichessIsLoading ? renderSkeleton() : (
          <TableBody>
              <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>Chess</TableCell>
                <TableCell align="right">{chessDotComData?.chessBullet?.last.rating ?? "---"}</TableCell>
                <TableCell align="right">{chessDotComData?.chessBlitz?.last.rating ?? "---"}</TableCell>
                <TableCell align="right">{chessDotComData?.chessRapid?.last.rating ?? "---"}</TableCell>
              </TableRow>
              <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>Lichess</TableCell>
                <TableCell align="right">{lichessData?.perfs.bullet.games === 0 ? "---" : lichessData?.perfs.bullet.rating}</TableCell>
                <TableCell align="right">{lichessData?.perfs.blitz.games === 0 ? "---" : lichessData?.perfs.blitz.rating}</TableCell>
                <TableCell align="right">{lichessData?.perfs.rapid.games === 0 ? "---" : lichessData?.perfs.rapid.rating}</TableCell>
              </TableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}

const renderSkeleton = () => (
  <TableBody>
    {[...new Array(2)].map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell><Skeleton animation="wave" /></TableCell>
      </TableRow>
    ))}
  </TableBody>
);