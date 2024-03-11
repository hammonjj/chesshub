import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import useToast from "../hooks/useToast";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [signUpButtonEnabled, setSignUpButtonEnabled] = useState(true);

  const { showError } = useToast();

  async function onSignUp(event: { preventDefault: () => void }) {
    event.preventDefault();
    setSignUpButtonEnabled(false);

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      showError("Unable to sign up: " + error.message);
    } else {
      navigate("validate-account");
    }

    setSignUpButtonEnabled(true);
  }

  async function signInWithProvider(provider: "google" | "facebook") {
    const { error } = await supabase.auth.signInWithOAuth({
      provider
    });

    if (error) {
      showError(`Error with ${provider} login: ${error.message}`);
    }
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
          alignItems: "center"
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => signInWithProvider("google")}
        >
          Sign up with Google
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ mt: 1 }}
          onClick={() => signInWithProvider("facebook")}
        >
          Sign up with Facebook
        </Button>
        <Box component="form" onSubmit={onSignUp} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            inputProps={{
              autoCapitalize: "none"
            }}
          />
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
            disabled={
              !signUpButtonEnabled ||
              email === "" ||
              password === "" ||
              passwordConfirmation === "" ||
              password !== passwordConfirmation
            }
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
