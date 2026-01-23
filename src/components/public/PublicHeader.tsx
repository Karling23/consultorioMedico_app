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
      src="https://static.vecteezy.com/system/resources/thumbnails/022/791/223/small/blog-site-blogger-png.png"
      alt="logo"
      width="32"
      height="32"
      style={{ display: "block" }}
    />
    <Typography variant="h6">BlogApp</Typography>
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