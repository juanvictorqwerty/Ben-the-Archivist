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

        // Listen for a custom event that signals login/logout
        window.addEventListener('authChange', checkAuthStatus);

        return () => {
            window.removeEventListener('authChange', checkAuthStatus);
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
        // Dispatch a custom event to notify other components (like the header)
        window.dispatchEvent(new CustomEvent('authChange'));
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <List>
                <ListItemButton component={RouterLink} to="/upload">
                    <ListItemText primary="Upload" />
                </ListItemButton>
                {isAuthenticated ? (
                    <>
                        <ListItemButton component={RouterLink} to="/account">
                            <ListItemText primary="Account" />
                        </ListItemButton>
                        <ListItemButton component="button" onClick={handleLogout} sx={{ color: 'red' }}>
                            <ListItemText 
                                primary="Logout" 
                                slotProps={{ primary: { sx: { color: 'red' } } }}
                            />
                        </ListItemButton>
                    </>
                ) : (
                    <>
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
        <AppBar 
            position="fixed" 
            elevation={0} 
            sx={{ 
                backgroundColor: 'primary.main', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)' 
            }}>
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
                            padding: '6px 8px', // Add padding to match button look
                            '&:hover': { backgroundColor: '#003366', color: 'white', borderRadius: '4px' }
                        }}
                    >
                        Bob the Archivist
                    </Typography>
                </Box>

                {/* Right side: Search + Upload + Auth buttons */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button 
                        color="inherit" 
                        component={RouterLink} 
                        to="/search"
                        sx={{ '&:hover': { backgroundColor: '#003366', color: 'white' } }}
                    >
                        Search
                    </Button>
                    {/* Hide these buttons on mobile, show only on desktop */}
                    {!isMobile && (
                        <>
                            <Button 
                                color="inherit" 
                                component={RouterLink} 
                                to="/upload"
                                sx={{ '&:hover': { backgroundColor: '#003366', color: 'white' } }}
                            >
                                Upload
                            </Button>
                            {isAuthenticated ? (
                                <>
                                    <Button 
                                        color="inherit" 
                                        component={RouterLink} to="/account"
                                        sx={{ '&:hover': { backgroundColor: '#003366', color: 'white' } }}
                                    >
                                        Account
                                    </Button>
                                    <Button 
                                        color="inherit" 
                                        onClick={handleLogout}
                                        sx={{ 
                                            color: 'white', 
                                            backgroundColor: 'red', 
                                            '&:hover': { backgroundColor: 'darkred' } 
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button 
                                        color="inherit" 
                                        component={RouterLink} 
                                        to="/login"
                                        sx={{ '&:hover': { backgroundColor: '#003366', color: 'white' } }}
                                    >
                                        Login
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        color="inherit" 
                                        component={RouterLink} 
                                        to="/signin"
                                        sx={{ borderColor: 'rgba(255, 255, 255, 0.5)', '&:hover': { borderColor: 'white', backgroundColor: '#003366', color: 'white' } }}
                                    >
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