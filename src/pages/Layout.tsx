import Toast from "../components/Toast";
import SettingsContext from "../contexts/SettingsContext";
import { ToastProvider } from "../contexts/ToastProvider";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
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
        <div style={{marginLeft: "0.5rem", marginRight: "0.5rem"}}>
          <Outlet />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}