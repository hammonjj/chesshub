import useToast from "../../hooks/useToast";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { supabase } from "../../utils/supabaseClient";
import { useState } from "react";

interface ForgotPasswordDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPasswordDialog(props: ForgotPasswordDialogProps) {
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');

  function handleClose() {
    setEmail('');
    props.handleClose();
  }

  async function handleSubmit() {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: "http://rfuelr.netlify.app/change-password" }
    );
    
    if(error) {
      showError("Unable to send password reset email: " + error.message);
    } else {
      showSuccess("Password Reset Email Sent");
    }

    handleClose();
  }

  return (
    <Dialog
      open={props.open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      fullWidth={true}
      PaperProps={{ 
        style: { 
          width: '75%', 
          margin: 'auto', 
          transform: 'translateY(-5rem)' 
        }
      }}
    >
      <DialogTitle>Recover Password</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoFocus
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          disabled={email === ''}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}