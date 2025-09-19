import { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Typography,
    IconButton,
    useMediaQuery,
    useTheme,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import  hasKnoxToken  from '../context/ISAUTH';
import MenuIcon from '@mui/icons-material/Menu';

function Header() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Check authentication status on component mount and when token changes
    useEffect(() => {
        const checkAuthStatus = () => {
            const hasToken = hasKnoxToken();
            setIsAuthenticated(hasToken);
        };

        checkAuthStatus();
        
        // Optional: Listen for storage changes to update auth status across tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'authToken') {
                checkAuthStatus();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also check periodically in case token is removed programmatically
        const interval = setInterval(checkAuthStatus, 5000); // Check every 5 seconds

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLogout = () => {
        // Remove the Knox token
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('username');
        sessionStorage.removeItem('username');
        // Update the authentication status
        setIsAuthenticated(false);

    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <List>
                {isAuthenticated ? (
                    <>
                        <ListItemButton component={RouterLink} to="/account">
                            <ListItemText primary="Account" />
                        </ListItemButton>
                        <ListItem component="button" onClick={handleLogout}>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItemButton component={RouterLink} to="/upload">
                            <ListItemText primary="Upload" />
                        </ListItemButton>
                        <ListItemButton component={RouterLink} to="/login">
                            <ListItemText primary="Login" />
                        </ListItemButton>
                        <ListItemButton component={RouterLink} to="/signin">
                            <ListItemText primary="Sign In" />
                        </ListItemButton>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <AppBar position="fixed">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Left side */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                        }}
                    >
                        Bob the Archivist
                    </Typography>
                </Box>

                {/* Right side: Search + Upload + Auth buttons */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button color="inherit" component={RouterLink} to="/search">
                        Search
                    </Button>
                    {/* Hide these buttons on mobile, show only on desktop */}
                    {!isMobile && (
                        <>
                            <Button color="inherit" component={RouterLink} to="/upload">
                                Upload
                            </Button>
                            {isAuthenticated ? (
                                <>
                                    <Button color="inherit" component={RouterLink} to="/account">
                                        Account
                                    </Button>
                                    <Button color="inherit" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button color="inherit" component={RouterLink} to="/login">
                                        Login
                                    </Button>
                                    <Button color="inherit" component={RouterLink} to="/signin">
                                        Sign In
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </Box>
            </Toolbar>

            <Drawer
                variant="temporary"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
}

export default Header;