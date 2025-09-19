import { Container,Paper,TextField,Button,Grid,Link, Typography, Box } from "@mui/material"
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import { Link as RouterLink,useNavigate } from 'react-router-dom';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function LoginPage(){
    const navigate = useNavigate();
    const [email, setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                // Store username in localStorage if available
                if (data && data.username) {
                    localStorage.setItem('username', data.username);
                }
                navigate('/');
            } else {
                const errorData = await response.json();
                alert(errorData.detail || 'Login failed');
            }
        } catch (error: any) {
            alert(error.message || 'Network error');
        }
    };
    return(
    <Container maxWidth="xs" sx={{ mt: 8 }}>
        <Paper elevation={10} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5">Login</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{mt:1}}>
            <TextField
                margin="normal"
                required
                fullWidth
                type="email"
                id="email"
                autoComplete="email"
                autoFocus
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                autoComplete="password"
                autoFocus
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                slotProps={{
                    input: {
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <Visibility style={{ color: 'black' }} /> : <VisibilityOff style={{ color: 'black' }} />}
                            </IconButton>
                        </InputAdornment>,
                    }}}
                    
            />
            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, m: 2 }} // Keep the margin for spacing
                >
                    Enter
                </Button>
            </Grid>
            <Box>
                    <Link href='#' variant="body2">
                        Forgot your password ?
                    </Link>
            </Box>
            <Box>
                <Link component={RouterLink} to='/signin' variant="body2">{'Sign up'}</Link>
            </Box>
        </Box>
        </Paper>
    </Container>
    )
};

export default LoginPage;