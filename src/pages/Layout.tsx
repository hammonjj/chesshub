import LoggedInNavigationBar from "../components/LoggedInNavigationBar";
import Toast from "../components/Toast";
import { useAuth } from "../contexts/AuthContext";
import SettingsContext from "../contexts/SettingsContext";
import { ToastProvider } from "../contexts/ToastProvider";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const { session } = useAuth();
  const { darkMode } = useContext(SettingsContext);
  
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    }
  });
  
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <Toast />
        <CssBaseline />
        {session ? 
          <LoggedInNavigationBar /> : null}
        <div style={{ marginLeft: session ? "40px" : "0px"}}>
          <Outlet />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}