import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();

  if (!session) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after logging in, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" replace />;
  }

  return children;
};