import { useState } from 'react';
import { Drawer, List, ListItemIcon, ListItemText, Divider, Toolbar, AppBar, Typography, Box, ListItemButton } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { CircularProgress } from '@mui/material';

import Home from "../pages/Home";
import Settings from "../pages/Settings";
import useGames from '../hooks/useGames';
import Explorer from '../pages/Explorer';
import { useNavigate } from 'react-router-dom';
import Analysis from '../pages/Analysis';
import Insights from '../pages/Insights';

const drawerWidth = 240;
const miniDrawerWidth = 56;

export default function LoggedInNavigationBar() {
  const nav = useNavigate();
  const { syncExternalAccountsToLocalDb, isLoadingGames } = useGames();
  const [open] = useState(false);
  const [fetchingExternalData, setFetchingExternalData] = useState(false);

  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  const pages = [
    { text: 'Home', icon: <HomeIcon />, component: <Home />, route: "/" },
    { text: 'Insights', icon: <LeaderboardIcon />, component: <Insights />, route: "/insights"},
    { text: 'Explorer', icon: <DeviceHubIcon />, component: <Explorer />, route: "/explorer"},
    { text: 'Analysis', icon: <InsightsIcon />, component: <Analysis />, route: "/analysis" },
    { text: 'Settings', icon: <SettingsIcon />, component: <Settings />, route: "/settings" },
  ];

  async function  handleRefetchClick() {
    setFetchingExternalData(true);
    await syncExternalAccountsToLocalDb();
    setFetchingExternalData(false);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        
        <Toolbar style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
          <div style={{ display: "flex", flexDirection: "row"}}>
            {/* <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton> */}
            <Typography variant="h6" noWrap component="div">
              Chess Hub
            </Typography>
          </div>
          <button onClick={handleRefetchClick} disabled={fetchingExternalData || isLoadingGames}>
            {fetchingExternalData ? (<CircularProgress size={16} />) : 'Refetch'}
          </button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',    
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : miniDrawerWidth,
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {pages.map((page) => (
            <ListItemButton key={page.text} onClick={() => nav(page.route)} sx={{ 
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 1)' },
              cursor: 'pointer'
            }}>
              <ListItemIcon >{page.icon}</ListItemIcon>
              {open && <ListItemText primary={page.text} />}
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          
          width: `calc(100% - ${open ? drawerWidth : miniDrawerWidth}px)`,
        }}
      >
        <Toolbar /> {/* This empty Toolbar is needed to offset the content below the AppBar */}
      </Box>
    </Box>
  );
}

