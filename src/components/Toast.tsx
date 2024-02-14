import { Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import useToast from "@hooks/useToast";

const Toast = () => {
  const { toast, setToast } = useToast();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (toast) {
      setOpen(true);
    }
  }, [toast]);

  const handleClose = () => {
    setOpen(false);
    setToast(null);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={toast?.severity} variant="filled">
        {toast?.message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
