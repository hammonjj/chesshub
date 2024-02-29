import { Grid, IconButton } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

interface BoardControlsProps {
  resetGame: () => void;
  goBackMove: () => void;
  goForwardMove: () => void;
  goLastMove: () => void;
}

export default function BoardControls(props: BoardControlsProps) {
  return (
    <Grid container spacing={0} width="100%">
      <Grid item sm={3}>
        <IconButton onClick={props.resetGame} size="small">
          <FirstPageIcon />
        </IconButton>
      </Grid>
      <Grid item sm={3}>
        <IconButton onClick={props.goBackMove} size="small">
          <KeyboardArrowLeftIcon />
        </IconButton>
      </Grid>
      <Grid item sm={3}>
        <IconButton onClick={props.goForwardMove} size="small">
          <KeyboardArrowRightIcon />
        </IconButton>
      </Grid>
      <Grid item sm={3}>
        <IconButton onClick={props.goLastMove} size="small">
          <LastPageIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
