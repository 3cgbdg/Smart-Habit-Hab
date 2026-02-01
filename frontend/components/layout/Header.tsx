"use client";

import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem, Divider, ListItemIcon } from "@mui/material";
import { Goal, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/AuthService";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { logOut } from "@/redux/profileSlice";

export default function Header() {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const { user } = useAppSelector(state => state.profile)
    const navItems = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Habits", href: "/habits" },
        { label: "Experiments", href: "/experiments" },
        { label: "Analytics", href: "/analytics" },
    ];

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => setAnchorEl(null);

    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        try {
            await authService.logOut();
            dispatch(logOut());
        } finally {
            handleCloseMenu();
            router.push("/auth/login");
            router.refresh();
        }
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "white", color: "text.primary", boxShadow: 1 }}>
            <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Link className=" flex gap-2 items-center" href={"/dashboard"}>
                        <Goal size={30} />
                        <span>SHHab</span>
                    </Link>

                    {/* Navigation items */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.href}
                                component={Link}
                                href={item.href}
                                sx={{
                                    color: "text.primary",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    "&:hover": {
                                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                                    },
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                </Box>
                <div className="flex items-center gap-2">
                    <p>{user?.email}</p>
                    {/* User menu icon */}
                    <IconButton
                        onClick={handleOpenMenu}
                        aria-controls={menuOpen ? "user-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={menuOpen ? "true" : undefined}
                        sx={{
                            backgroundColor: "primary.main",
                            color: "white",
                            width: 40,
                            height: 40,
                            "&:hover": {
                                backgroundColor: "primary.dark",
                            },
                        }}
                    >
                        <User size={20} />
                    </IconButton>

                    <Menu
                        id="user-menu"
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <MenuItem component={Link} href="/dashboard" onClick={handleCloseMenu}>
                            Dashboard
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <User size={18} />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
}
