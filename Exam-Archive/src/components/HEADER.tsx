import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Typography, IconButton, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemText, InputBase } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Box } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

function Header() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const drawer = (
    <Box
        onClick={handleDrawerToggle}
        sx={{ textAlign: 'center' }}
    >
        <List>
            <ListItem Button component={RouterLink} to="/">
                <ListItemText primary="Home" />
            </ListItem>
            {isAuthenticated ? (
            <ListItem Button onClick={() => setIsAuthenticated(false)}>
                <ListItemText primary="Logout" />
            </ListItem>
            ) : (
            <>
                <ListItem Button component={RouterLink} to="/login">
                    <ListItemText primary="Login" />
                </ListItem>
                <ListItem Button component={RouterLink} to="/signin">
                    <ListItemText primary="Sign In" />
                </ListItem>
            </>
            )}
        </List>
    </Box>
);

return (
    <AppBar position="static">
        <Toolbar>
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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Exam Archive
        </Typography>

        {isMobile ? (
            <IconButton color="inherit">
                <SearchIcon />
            </IconButton>
        ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{
                position: 'relative',
                borderRadius: theme.shape.borderRadius,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                },
                marginLeft: 0,
                width: '100%',
                [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(1),
                width: 'auto',
                },
            }}>
            <Box sx={{
                padding: theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                }}>
                <SearchIcon />
            </Box>
            <InputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                sx={{
                    color: 'inherit',
                    '& .MuiInputBase-input': {
                    padding: theme.spacing(1, 1, 1, `calc(1em + ${theme.spacing(4)})`),
                    transition: theme.transitions.create('width'),
                    width: '12ch',
                    '&:focus': {
                    width: '20ch',
                    },
                    },
                }}
            />
            </Box>
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
        </Box>
        )}
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