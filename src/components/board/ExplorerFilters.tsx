import { Dispatch } from 'react';
import { Button, ButtonGroup, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { ExplorerFilterAction, ExplorerFilterState } from '../../pages/Explorer';

interface ExplorerFiltersProps {
  state: ExplorerFilterState;
  dispatch: Dispatch<ExplorerFilterAction>;
}

export default function ExplorerFilters(props: ExplorerFiltersProps) {
  const { dispatch, state } = props;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button disabled={state.color === 'White'} onClick={() => dispatch({ type: 'SET_COLOR', payload: 'White' })}>White</Button>
          <Button disabled={state.color === 'Black'} onClick={() => dispatch({ type: 'SET_COLOR', payload: 'Black' })}>Black</Button>
        </ButtonGroup>
      </div>
      <FormControl fullWidth style={{ marginBottom: "10px" }}>
        <InputLabel>Date</InputLabel>
        <Select 
          value={state.date} 
          label="Date" 
          onChange={(e) => dispatch({ type: 'SET_DATE', payload: e.target.value })}
        >
          <MenuItem value="all-time">All time</MenuItem>
          <MenuItem value="this-week">This week</MenuItem>
          <MenuItem value="this-month">This month</MenuItem>
          <MenuItem value="last-three-months">Last three months</MenuItem>
          <MenuItem value="this-year">This year</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth style={{ marginBottom: "10px" }}>
        <InputLabel>Variant</InputLabel>
        <Select 
          value={state.variant} 
          label="Variant" 
          onChange={(e) => dispatch({ type: 'SET_VARIANT', payload: e.target.value as 'All' | 'Bullet' | 'Rapid' | 'Blitz' | 'Classical'})}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Bullet">Bullet</MenuItem>
          <MenuItem value="Rapid">Rapid</MenuItem>
          <MenuItem value="Blitz">Blitz</MenuItem>
          <MenuItem value="Classical">Classical</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth style={{ marginBottom: "10px" }}>
        <InputLabel>Outcome</InputLabel>
        <Select 
          value={state.outcome} 
          label="Outcome" 
          onChange={(e) => dispatch({ type: 'SET_OUTCOME', payload: e.target.value as 'All' | 'Win' | 'Loss' | 'Draw'})}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Win">Win</MenuItem>
          <MenuItem value="Loss">Loss</MenuItem>
          <MenuItem value="Draw">Draw</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel control={<Checkbox checked={state.flipBoard} onChange={() => dispatch({ type: 'FLIP_BOARD' })} />} label="Flip Board" />
    </div>
  );
}
