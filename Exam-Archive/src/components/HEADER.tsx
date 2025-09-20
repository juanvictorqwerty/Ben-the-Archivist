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
    Menu,
    MenuItem,
    Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import  hasKnoxToken  from '../context/ISAUTH';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../assets/logo.png'; // Import your logo
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Import the 3-dots icon

function Header() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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
        handleMenuClose(); // Close menu on logout
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <List>
                <ListItemButton component={RouterLink} to="/upload">
                    <ListItemText primary="Upload" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/about">
                    <ListItemText primary="About Us" />
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
                    <Box
                        component={RouterLink}
                        to="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                            padding: '6px 8px', // Add padding to match button look
                            '&:hover': { backgroundColor: '#003366', color: 'white', borderRadius: '4px' }
                        }}
                    >   
                        <img src={logo} alt="Bob the Archivist Logo" style={{ height: '30px', marginRight: '10px' }} />
                        <Typography variant="h6" component="span">
                            Bob the Archivist
                        </Typography>
                    </Box>
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
                            <Button 
                                color="inherit" 
                                component={RouterLink} 
                                to="/about"
                                sx={{ '&:hover': { backgroundColor: '#003366', color: 'white' } }}
                            >
                                About Us
                            </Button>
                            {isAuthenticated ? (
                                <>
                                    <IconButton
                                        size="large"
                                        edge="end"
                                        aria-label="account of current user"
                                        aria-controls="primary-search-account-menu"
                                        aria-haspopup="true"
                                        onClick={handleMenuOpen}
                                        color="inherit"
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        id="primary-search-account-menu"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem component={RouterLink} to="/account" onClick={handleMenuClose}>
                                            Account
                                        </MenuItem>
                                        <MenuItem 
                                            onClick={handleLogout} 
                                            sx={{ color: 'red' }}
                                        >
                                            Logout
                                        </MenuItem>
                                    </Menu>
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