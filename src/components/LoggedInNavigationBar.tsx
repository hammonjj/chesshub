import { BottomNavigation, BottomNavigationAction, Fab, Paper } from "@mui/material";
import Settings from "@pages/Settings";
import { Suspense, lazy, useState } from "react";
import HomeIcon from '@mui/icons-material/Home';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import Data from "@pages/Data";
import Home from "@pages/Home";

const SubmitRefuelDialog = lazy(() => import('./Dialogs/SubmitRefuelDialog'));

export default function LoggedInNavigationBar() {
  const [value, setValue] = useState(0);
  const [refuelOpen, setRefuelOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {value === 0 && <Home/>}
      {value === 1 && <Data/>}
      {value === 2 && <Settings/>}
      
      {refuelOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <SubmitRefuelDialog open={refuelOpen} handleClose={() => setRefuelOpen(false)}/>
        </Suspense>
      )}

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <Fab 
          color="primary" 
          aria-label="add"
          onClick={() => setRefuelOpen(true)}
          style={{ position: 'absolute', bottom: 70, right: 16 }}>
          <AddIcon />
        </Fab>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Data" icon={<InsightsIcon />} />
          <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </div>
  )
}