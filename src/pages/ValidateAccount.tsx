import { Typography } from "@mui/material";

export default function ValidateAccount() {
  return (
    <div style={{marginLeft: "0.5rem", marginRight: "0.5rem"}}>
      <h1>Validate Account</h1>
      <Typography>
        Your account has been successfully created, but it needs to be validated before logging in. 
        Please click the link in the email sent to you to validate your account.
      </Typography>
    </div>
  );
}