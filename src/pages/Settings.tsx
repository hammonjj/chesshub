import { Button } from '@mui/material';
import { supabase } from '@utils/supabaseClient';
import VehicleAccordian from '@components/Settings/VehicleAccordion';
import PreferencesAccordion from '@components/Settings/PreferencesAccordion';
import AccountAccordion from '@components/Settings/AccountAccordion';
import { useQueryClient } from '@tanstack/react-query';

export default function Settings() {
  const queryClient = useQueryClient();
  
  async function signOut() {
    queryClient.invalidateQueries();
    supabase.auth.signOut();
  }

  return (
    <div>
      <h1>Settings</h1>
      
      <VehicleAccordian/>
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