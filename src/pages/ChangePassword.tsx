import useToast from "@hooks/useToast";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { supabase } from "@utils/supabaseClient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [changePasswordButtonEnabled, setChangePasswordButtonEnabled] = useState(true);

  const { showError, showSuccess } = useToast();
    
  async function onPasswordChange(event: { preventDefault: () => void; }) {
    event.preventDefault();
    setChangePasswordButtonEnabled(false);

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if(error) {
      showError("Unable to change password: " + error.message);
    } else {
      showSuccess("Password changed successfully");
      navigate('/');
    }

    setChangePasswordButtonEnabled(true);
  }

  return (
    <Container component="main" maxWidth="sm">
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          <Box component="form" onSubmit={onPasswordChange} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password_validate"
              label="Retype Password"
              type="password"
              id="password_validate"
              autoComplete="current-password"
              value={passwordConfirmation}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value);
              }}
              error={password !== passwordConfirmation}
              helperText={password !== passwordConfirmation ? "Passwords do not match" : ""}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!changePasswordButtonEnabled || 
                (password === '' || 
                passwordConfirmation === '' || 
                password !== passwordConfirmation)}
            >
              Change Password
            </Button>
          </Box>
        </Box>
      </Container>
  );
}