import { Container,Paper,TextField,Button,Grid,Link, Typography, Box } from "@mui/material"
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function LoginPage(){
    const [email, setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit=(event: { preventDefault: () => void; })=>{
        event.preventDefault();
        console.log('Login attempt ',{email,password});
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
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Visibility style={{ color: 'black' }} /> : <VisibilityOff style={{ color: 'black' }} />}
                            </IconButton>
                        </InputAdornment>
                    ),
                    }}
                    
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
            <Grid container>

                    <Grid item xs={12}>
                        <Link href='#' variant="body2">
                            Forgot your password ?
                        </Link>
                    </Grid>
                    <Grid item xs={12}>
                        <Link href='#' variant="body2">
                            {'No account ? Sign up'} ?
                        </Link>
                    </Grid>    
            </Grid> 
        </Box>
        </Paper>
    </Container>
    )
};

export default LoginPage;