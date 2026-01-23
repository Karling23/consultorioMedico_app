import { Box, Container, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";
import type { JSX } from "react";

export default function PublicLayout(): JSX.Element {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
        <PublicHeader />

        <Toolbar />

        <Container sx={{ py: 3 }}>
            <Outlet />
        </Container>

        <PublicFooter />
        </Box>
    );
}