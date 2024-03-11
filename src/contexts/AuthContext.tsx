import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Session } from "@supabase/supabase-js";
import useGames from "../hooks/useGames";

interface AuthContextType {
  session: Session | null;
}

const defaultAuthContext: AuthContextType = {
  session: null
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { syncExternalAccountsToLocalDb } = useGames();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      syncExternalAccountsToLocalDb();
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
