import { Dispatch, useState } from "react";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  SelectChangeEvent,
  TextField
} from "@mui/material";
import { ExplorerFilterAction, ExplorerFilterState } from "../../pages/Explorer";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface ExplorerFiltersProps {
  state: ExplorerFilterState;
  dispatch: Dispatch<ExplorerFilterAction>;
}

export default function ExplorerFilters(props: ExplorerFiltersProps) {
  const { dispatch, state } = props;
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleCustomDateRange = () => {
    if (startDate && endDate) {
      dispatch({
        type: "SET_CUSTOM_DATE_RANGE",
        payload: { startDate, endDate }
      });
    }
  };

  const handleDateChange = (event: SelectChangeEvent): void => {
    const value = event.target.value;

    //This is probably poor form and needs to be refactored at some point
    dispatch({ type: "SET_DATE", payload: value });
    if (value === "custom" && startDate && endDate) {
      dispatch({
        type: "SET_CUSTOM_DATE_RANGE",
        payload: { startDate, endDate }
      });
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button disabled={state.color === "White"} onClick={() => dispatch({ type: "SET_COLOR", payload: "White" })}>
            White
          </Button>
          <Button disabled={state.color === "Black"} onClick={() => dispatch({ type: "SET_COLOR", payload: "Black" })}>
            Black
          </Button>
        </ButtonGroup>
      </div>
      <FormControl fullWidth style={{ marginBottom: "10px" }} size="small">
        <InputLabel>Date</InputLabel>
        <Select value={state.date} label="Date" onChange={handleDateChange}>
          <MenuItem value="all-time">All time</MenuItem>
          <MenuItem value="this-week">This week</MenuItem>
          <MenuItem value="this-month">This month</MenuItem>
          <MenuItem value="last-three-months">Last three months</MenuItem>
          <MenuItem value="this-year">This year</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </Select>
      </FormControl>

      {state.date === "custom" && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              slotProps={{ textField: { size: "small" } }}
              // @ts-expect-error:next-line
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              slotProps={{ textField: { size: "small" } }}
              // @ts-expect-error:next-line
              renderInput={(params) => <TextField {...params} />}
            />
            <Button variant="contained" color="primary" onClick={handleCustomDateRange}>
              Set
            </Button>
          </div>
        </LocalizationProvider>
      )}

      <FormControl fullWidth style={{ marginBottom: "10px" }} size="small">
        <InputLabel>Variant</InputLabel>
        <Select
          value={state.variant}
          label="Variant"
          onChange={(e) =>
            dispatch({
              type: "SET_VARIANT",
              payload: e.target.value as "All" | "Bullet" | "Rapid" | "Blitz" | "Classical"
            })
          }
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Bullet">Bullet</MenuItem>
          <MenuItem value="Rapid">Rapid</MenuItem>
          <MenuItem value="Blitz">Blitz</MenuItem>
          <MenuItem value="Classical">Classical</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth style={{ marginBottom: "10px" }} size="small">
        <InputLabel>Outcome</InputLabel>
        <Select
          value={state.outcome}
          label="Outcome"
          onChange={(e) =>
            dispatch({ type: "SET_OUTCOME", payload: e.target.value as "All" | "Win" | "Loss" | "Draw" })
          }
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Win">Win</MenuItem>
          <MenuItem value="Loss">Loss</MenuItem>
          <MenuItem value="Draw">Draw</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={<Checkbox checked={state.flipBoard} onChange={() => dispatch({ type: "FLIP_BOARD" })} />}
        label="Flip Board"
      />
    </div>
  );
}
