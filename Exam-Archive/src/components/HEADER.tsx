import { useState } from 'react';
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
import MenuIcon from '@mui/icons-material/Menu';

function Header() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
        <List>
            {isAuthenticated ? (
            <ListItem component="button" onClick={() => setIsAuthenticated(false)}>
                <ListItemText primary="Logout" />
            </ListItem>
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
            <Typography variant="h6" component="div">
                Exam Archive
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
                    <Button color="inherit" onClick={() => setIsAuthenticated(false)}>
                    Logout
                    </Button>
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