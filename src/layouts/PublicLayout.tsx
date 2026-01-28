import { Box, Container, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";
import type { JSX } from "react";

export default function PublicLayout(): JSX.Element {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "background.default",
                color: "text.primary",
                backgroundImage:
                    "radial-gradient(circle at 10% 20%, rgba(14, 165, 233, 0.12) 0%, transparent 45%), radial-gradient(circle at 90% 10%, rgba(16, 185, 129, 0.14) 0%, transparent 40%)",
            }}
        >
        <PublicHeader />

        <Toolbar />

        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
            <Outlet />
        </Container>

        <PublicFooter />
        </Box>
    );
}
