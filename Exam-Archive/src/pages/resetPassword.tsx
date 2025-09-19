import { TextField,Button,Grid, Typography, Box } from "@mui/material"
import { useState } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import {useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function resetPassword(){
    const navigate = useNavigate();
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('')
    const [showPassword, setShowPassword] = useState(false);
    
        const handleSubmit=(event: { preventDefault: () => void; })=>{
            event.preventDefault();
            if (confirmPassword==password){
                axios.post('http://127.0.0.1:8000/api/password-reset/confirm/', {
                    password: password
                })
                .then(response => {
                    console.log('Password reset successful', response.data);                    
                    navigate('/login');
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
        <>  
        <Box component="form" onSubmit={handleSubmit} sx={{mt:1}}>
            <Typography component="h1" variant="h5">Reset Password</Typography>
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
            </Box>
        </>

    )
}
export default resetPassword;