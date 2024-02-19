import { Typography, Box } from '@mui/material';
import { GameStats } from '../types';

interface StatsBarProps {
  stats: GameStats;
  exclude: number;
}
export default function StatsBar(props: StatsBarProps) {
  const winPercentage = (props.stats.wins / props.stats.total) * 100;
  const drawPercentage = (props.stats.draws / props.stats.total) * 100;
  const lossPercentage = (props.stats.losses / props.stats.total) * 100;

  return (
    <Box sx={{ width: '100%', display: 'flex', height: 20, backgroundColor: '#e0e0e0', border: '1px solid #c0c0c0' }}>
      {winPercentage !== 0 &&
        <Box sx={{ width: `${winPercentage}%`, backgroundColor: 'green', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {winPercentage > props.exclude &&
            <Typography variant="caption" sx={{ color: winPercentage > 10 ? 'white' : 'black' }}>{winPercentage.toFixed(0)}%</Typography>}
        </Box>}
      {drawPercentage !== 0 &&
        <Box sx={{ width: `${drawPercentage}%`, backgroundColor: 'gray', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {drawPercentage > props.exclude &&
            <Typography variant="caption" sx={{ color: drawPercentage > 10 ? 'white' : 'black' }}>{drawPercentage.toFixed(0)}%</Typography>}
        </Box>}
      {lossPercentage !== 0 &&
        <Box sx={{ width: `${lossPercentage}%`, backgroundColor: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {lossPercentage > props.exclude &&
            <Typography variant="caption" sx={{ color: lossPercentage > 10 ? 'white' : 'black' }}>{lossPercentage.toFixed(0)}%</Typography>}
        </Box>}
    </Box>
  );
}