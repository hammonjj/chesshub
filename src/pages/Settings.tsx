import { Button } from '@mui/material';
import { supabase } from '../utils/supabaseClient';
import PreferencesAccordion from '../components/settings/PreferencesAccordion';
import AccountAccordion from '../components/settings/AccountAccordion';
import { useQueryClient } from '@tanstack/react-query';
import ChessAccountAccordion from '../components/settings/ChessAccountAccordion';

export default function Settings() {
  const queryClient = useQueryClient();
  
  async function signOut() {
    queryClient.invalidateQueries();
    supabase.auth.signOut();
  }

  return (
    <div>
      <h1>Settings</h1>

      <ChessAccountAccordion/>
      <PreferencesAccordion/>
      <AccountAccordion/>

      <Button 
        variant="contained" 
        onClick={signOut}
        style={{ marginTop: '1rem', marginLeft: '0.5rem' }}
      >
        Log Out
      </Button>
    </div>
  );
}