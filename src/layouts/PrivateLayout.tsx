import {
    AppBar,
    Box,
    Button,
    Breadcrumbs,
    Divider,
    Drawer,
    IconButton,
    Avatar,
    Stack,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import { Outlet, useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import { useState, type JSX } from "react";
import { useAuth } from "../context/AuthContext";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import PeopleIcon from "@mui/icons-material/People";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LinkIcon from "@mui/icons-material/Link";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryIcon from "@mui/icons-material/History";
import EventIcon from "@mui/icons-material/Event";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

const drawerWidth = 260;

type NavItem = {
    label: string;
    to: string;
    icon: JSX.Element;
};

export default function PrivateLayout(): JSX.Element {
    const { user, logout } = useAuth();
    const isAdmin = (user?.rol || "").toLowerCase() === "admin";
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems: NavItem[] = [
        { label: "Inicio", to: "/dashboard", icon: <DashboardIcon /> },
        { label: "Medicamentos", to: "/dashboard/medicamentos", icon: <CategoryIcon /> },
        { label: "Especialidades", to: "/dashboard/especialidades", icon: <LocalHospitalIcon /> },
        { label: "Doctores", to: "/dashboard/doctores", icon: <PeopleIcon /> },
        { label: "Doctores-Consultorios", to: "/dashboard/doctores-consultorios", icon: <LinkIcon /> },
        { label: "Citas medicas", to: "/dashboard/citas-medicas", icon: <EventIcon /> },
        { label: "Pacientes", to: "/dashboard/pacientes", icon: <PeopleIcon /> },
        { label: "Consultorios", to: "/dashboard/consultorios", icon: <MeetingRoomIcon /> },
        { label: "Recetas", to: "/dashboard/recetas", icon: <ReceiptLongIcon /> },
        { label: "Historial clinico", to: "/dashboard/historial-clinico", icon: <HistoryIcon /> },
        ...(isAdmin
            ? [{ label: "Usuarios", to: "/dashboard/users", icon: <GroupIcon /> }]
            : []),
    ];

    const onGo = (to: string) => {
        navigate(to);
        setOpen(false);
    };

    const onLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    const initials = (user?.username || "U").slice(0, 2).toUpperCase();

    const drawer = (
        <Box sx={{ width: drawerWidth }}>
        <Box sx={{ px: 2, py: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "primary.dark" }}>{initials}</Avatar>
            <Box>
                <Typography variant="subtitle1">{user?.username}</Typography>
                <Typography variant="caption" color="text.secondary">
                Rol: {user?.rol}
                </Typography>
            </Box>
            </Stack>
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
            <Button fullWidth variant="outlined" color="secondary" onClick={onLogout}>
            Cerrar sesión
            </Button>
        </Box>
        </Box>
    );

    return (
        <Box sx={{ minHeight: "100vh" }}>
        <AppBar position="fixed">
            <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setOpen(true)}
              sx={{ mr: 2 }}
              aria-label="menu"
            >
                <MenuIcon />
            </IconButton>

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                VitaCare
            </Typography>

            <Button color="inherit" onClick={() => navigate("/")}>
                Ir a publico
            </Button>
            </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
            {drawer}
        </Drawer>

        <Toolbar />

        <Box sx={{ p: 3 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            {(() => {
                const segments = location.pathname.split("/").filter(Boolean);
                const crumbs: { label: string; to?: string }[] = [];
                if (segments[0] === "dashboard") {
                crumbs.push({ label: "Inicio", to: "/dashboard" });
                if (segments.length > 1) {
                    const full = `/dashboard/${segments[1]}`;
                    const item = navItems.find((n) => n.to === full);
                    crumbs.push({ label: item?.label ?? segments[1] });
                }
                }
                return crumbs.map((c, i) =>
                c.to && i < crumbs.length - 1 ? (
                    <Button
                    key={c.to}
                    component={RouterLink}
                    to={c.to}
                    color="inherit"
                    size="small"
                    >
                    {c.label}
                    </Button>
                ) : (
                    <Typography key={`${c.label}-${i}`} color="text.primary">
                    {c.label}
                    </Typography>
                )
                );
            })()}
            </Breadcrumbs>
            <Outlet />
        </Box>
        </Box>
    );
}
