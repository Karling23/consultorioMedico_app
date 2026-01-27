import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { JSX } from "react";

export default function PublicHeader(): JSX.Element {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box
  sx={{
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 2,
  }}
>
  <Box display="flex" alignItems="center" gap={2}>
    <img
      src={"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23E3F2FD'/><path d='M14 6h4v6h6v4h-6v6h-4v-6H8v-4h6z' fill='%231976D2'/></svg>"}
      alt="logo"
      width="32"
      height="32"
      style={{ display: "block" }}
    />
    <Typography variant="h6">VitaCare</Typography>
  </Box>
</Box>


        <Box sx={{ flexGrow: 1 }} />

        <Button color="inherit" component={RouterLink} to="/">
          Home
        </Button>

        <Button color="inherit" component={RouterLink} to="/auth/login">
          Login
        </Button>

        <Button color="inherit" component={RouterLink} to="/auth/register">
          Register
        </Button>
      </Toolbar>
    </AppBar>
  );
}
