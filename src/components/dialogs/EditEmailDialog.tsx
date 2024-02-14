import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import useToast from "../../hooks/useToast";
import { supabase } from "../../utils/supabaseClient";

interface EditEmailDialogProps {
  open: boolean;
  currentEmail: string;
  handleClose: () => void;
}

export default function EditEmailDialog(props: EditEmailDialogProps) {
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    setEmail(props.currentEmail);
  }, [props.currentEmail]);

  function handleClose() {
    props.handleClose();
  }

  async function handleSubmit() {
    const { error } = await supabase.auth.updateUser({email: email});

    if (error) {
      showError("Unable to update email: " + error.message);
    } else {
      handleClose();
      showSuccess("Email successfully updated");
    }
  }

  return (
    <Dialog
      open={props.open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle>Edit Email</DialogTitle>
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}