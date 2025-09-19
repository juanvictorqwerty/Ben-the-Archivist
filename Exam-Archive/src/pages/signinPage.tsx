import { Container,Paper,TextField,Button,Grid,Link, Typography, Box } from "@mui/material"
import { useState } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import { Link as RouterLink,useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function SignInPage(){
    const navigate = useNavigate();
    const [email, setEmail]=useState('');
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('')
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit=(event: { preventDefault: () => void; })=>{
        event.preventDefault();
        if (confirmPassword==password){
            axios.post('http://127.0.0.1:8000/register/', {
                username:username,
                email: email,
                password: password
            })
            .then(response => {
                console.log('Registration successful', response.data);
                // Store username in localStorage
                if (username) {
                    localStorage.setItem('username', username);
                }
                // Store token in localStorage if present
                if (response.data && response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                }
                navigate('/');
            })
            .catch(error => {
                console.error('There was an error during registration:', error);
                alert(`Registration failed: ${error.message}`);
            });
        }
        else{
            alert("The passwords do not match");
        }
        
    };
    return(
    <Container maxWidth="xs" sx={{ mt: 8 }}>
        <Paper elevation={10} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5">Sign in</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{mt:1}}>
            <TextField
                margin="normal"
                required
                fullWidth
                type="email"
                id="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                label="Email Address"
            />
            <TextField
                margin="normal"
                required
                fullWidth
                type="username"
                id="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                label="Username"
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                autoComplete="password"
                autoFocus
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                slotProps={{
                    input:{
                        inputProps: {
                        minLength: 8,
                    },
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                            >
                                {showPassword ? <Visibility style={{ color: 'black' }} /> : <VisibilityOff style={{ color: 'black' }} />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                autoComplete="confirmPassword"
                autoFocus
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                slotProps={{
                    input:{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                            >
                                {showPassword ? <Visibility style={{ color: 'black' }} /> : <VisibilityOff style={{ color: 'black' }} />}
                            </IconButton>
                        </InputAdornment>
                    )
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
            <div>Have an account ?</div>
            <Box>
                <Link component={RouterLink} to='/login' variant="body2">{'Login'}</Link>
            </Box>

        </Box>
        </Paper>
    </Container>
    )
};

export default SignInPage;