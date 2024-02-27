import { Dispatch } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {
  InsightsFilterAction,
  InsightsFilterState
} from "../../pages/Insights";

interface InsightsFiltersProps {
  state: InsightsFilterState;
  dispatch: Dispatch<InsightsFilterAction>;
}

export default function InsightsFilters(props: InsightsFiltersProps) {
  const { dispatch, state } = props;

  return (
    <div>
      <FormControl fullWidth style={{ marginBottom: "10px" }} size="small">
        <InputLabel>Date</InputLabel>
        <Select
          value={state.date}
          label="Date"
          onChange={(e) =>
            dispatch({ type: "SET_DATE", payload: e.target.value })
          }
        >
          <MenuItem value="all-time">All time</MenuItem>
          <MenuItem value="this-week">This week</MenuItem>
          <MenuItem value="this-month">This month</MenuItem>
          <MenuItem value="last-three-months">Last three months</MenuItem>
          <MenuItem value="this-year">This year</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth style={{ marginBottom: "10px" }} size="small">
        <InputLabel>Variant</InputLabel>
        <Select
          value={state.variant}
          label="Variant"
          onChange={(e) =>
            dispatch({
              type: "SET_VARIANT",
              payload: e.target.value as
                | "All"
                | "Bullet"
                | "Rapid"
                | "Blitz"
                | "Classical"
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
    </div>
  );
}
