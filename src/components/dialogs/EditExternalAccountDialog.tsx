import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { ExternalAccount } from "../../types";

interface EditVehicleDialogProps {
  open: boolean;
  externalAccount: ExternalAccount | undefined;
  handleClose: () => void;
  onSubmit: (externalAccount: ExternalAccount) => Promise<void>;
}

export default function EditExternalAccountDialog(props: EditVehicleDialogProps) {
  const [accountName, setAccountName] = useState(props.externalAccount ? props.externalAccount.accountName : "");

  useEffect(() => {
    setAccountName(props.externalAccount ? props.externalAccount.accountName : "");
  }, [props.externalAccount]);

  function handleClose() {
    props.handleClose();
  }

  async function handleSubmit() {
    const editedVehicle = {
      accountName: accountName,
      platform: props.externalAccount!.platform
    };

    try {
      await props.onSubmit(editedVehicle);

      handleClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Unable to edit vehicle: " + error.message);
    }
  }

  return (
    <Dialog open={props.open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <DialogTitle>Edit External Account</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          required
          fullWidth
          id="make"
          label="Account Name"
          name="accountName"
          autoFocus
          value={accountName}
          onChange={(e) => {
            setAccountName(e.target.value);
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          disabled={true}
          id="platform"
          label="Account Platform"
          name="platform"
          value={props.externalAccount?.platform}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={accountName === ""}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
