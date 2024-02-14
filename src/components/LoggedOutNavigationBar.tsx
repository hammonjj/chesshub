import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useState } from "react";
import Login from "@pages/Login";
import SignUp from "@pages/SignUp";
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function LoggedInNavigationBar() {
  const [value, setValue] = useState(0);

  return (
    <div style={{ position: 'relative' }}>
      {value === 0 && <Login/>}
      {value === 1 && <SignUp/>}
      
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Log In" icon={<LoginIcon />} />
          <BottomNavigationAction label="Sign Up" icon={<PersonAddIcon />} />
        </BottomNavigation>
      </Paper>
    </div>
  )
}