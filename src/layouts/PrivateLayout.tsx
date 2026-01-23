import {
    AppBar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, type JSX } from "react";
import { useAuth } from "../context/AuthContext";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ArticleIcon from "@mui/icons-material/Article";
import GroupIcon from "@mui/icons-material/Group";

const drawerWidth = 260;

type NavItem = {
    label: string;
    to: string;
    icon: JSX.Element;
};

const navItems: NavItem[] = [
    { label: "Inicio", to: "/dashboard", icon: <DashboardIcon /> },
    { label: "Medicamentos", to: "/dashboard/medicamentos", icon: <CategoryIcon /> },
    { label: "Posts", to: "/dashboard/posts", icon: <ArticleIcon /> },
    { label: "Usuarios", to: "/dashboard/users", icon: <GroupIcon /> },
];

export default function PrivateLayout(): JSX.Element {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const onGo = (to: string) => {
        navigate(to);
        setOpen(false);
    };

    const onLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    const drawer = (
        <Box sx={{ width: drawerWidth }}>
        <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="h6">Panel</Typography>
            <Typography variant="body2" color="text.secondary">
            {user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
            Rol: {user?.rol}
            </Typography>
        </Box>

        <Divider />

        <List>
            {navItems.map((item) => (
            <ListItemButton
                key={item.to}
                selected={location.pathname === item.to}
                onClick={() => onGo(item.to)}
            >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
            </ListItemButton>
            ))}
        </List>

        <Box sx={{ px: 2, py: 2 }}>
            <Button fullWidth variant="outlined" onClick={onLogout}>
            Logout
            </Button>
        </Box>
        </Box>
    );

    return (
        <Box sx={{ minHeight: "100vh" }}>
        <AppBar position="fixed">
            <Toolbar>
            <IconButton color="inherit" edge="start" onClick={() => setOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
            </IconButton>

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Dashboard
            </Typography>

            <Button color="inherit" onClick={() => navigate("/")}>
                Ir a público
            </Button>
            </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
            {drawer}
        </Drawer>

        <Toolbar />

        <Box sx={{ p: 3 }}>
            <Outlet />
        </Box>
        </Box>
    );
}
