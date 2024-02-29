import "./App.css";
import SettingsProvider from "./contexts/SettingsProvider";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ValidateAccount from "./pages/ValidateAccount";
import ChangePassword from "./pages/ChangePassword";
import Layout from "./pages/Layout";
import Explorer from "./pages/Explorer";
import Settings from "./pages/Settings";
import Insights from "./pages/Insights";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AccessControl from "./pages/AccessControl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      staleTime: 600000
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="explorer"
                  element={
                    <ProtectedRoute>
                      <Explorer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="insights"
                  element={
                    <ProtectedRoute>
                      <Insights />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="analysis/:gameId?"
                  element={
                    <ProtectedRoute>
                      <Analysis />
                    </ProtectedRoute>
                  }
                />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="validate-account" element={<ValidateAccount />} />
                <Route path="login" element={<AccessControl />} />
              </Route>
            </Routes>
          </Router>
        </SettingsProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
