import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoggedInNavigationBar from "./components/LoggedInNavigationBar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import LoggedOutNavigationBar from "./components/LoggedOutNavigationBar";
import { supabase } from "./utils/supabaseClient";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      staleTime: 600000,
    },
  }
});

export default function AppContent() {
  const [session, setSession] = useState<Session | null>(null)
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, []);

  return (
    <QueryClientProvider client={queryClient}>          
        {session ? <LoggedInNavigationBar /> : <LoggedOutNavigationBar />}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}