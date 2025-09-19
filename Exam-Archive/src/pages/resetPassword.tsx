import { TextField, Button, Grid, Typography, Box, Container, Paper, Alert } from "@mui/material"
import { useState, useEffect } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import { useNavigate, useLocation } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Add a retry interceptor to axios
axios.interceptors.response.use(undefined, (err) => {
    const config = err.config;
    // If config does not exist or the retry option is not set, reject
    if (!config || !config.retry) return Promise.reject(err);

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;

    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= config.retry) {
        return Promise.reject(err);
    }

    // Increase the retry count
    config.__retryCount += 1;

    // Create new promise to handle exponential backoff
    const backoff = new Promise((resolve) => {
        setTimeout(() => {
            resolve(void 0);
        }, config.retryDelay || 1000);
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(() => axios(config));
});

function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError("No password reset token found. Please request a new one.");
        }
    }, [location]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        if (confirmPassword !== password) {
            setError("The passwords do not match.");
            setLoading(false);
            return;
        }

        if (!token) {
            setError("Missing token. Cannot reset password.");
            setLoading(false);
            return;
        }

        axios.post('http://127.0.0.1:8000/api/password-reset/confirm/', {
            password:password,
            token: token,
        }, {
            // @ts-ignore - Add custom config for retry
            retry: 3, // Number of retries
            retryDelay: 1000, // Delay between retries in ms
        })
                .then(response => {
                    console.log('Password reset successful', response.data);
                    alert('Password has been reset successfully! You can now log in.');
                    navigate('/login');
                })
                .catch(error => {
                    
                    console.error('There was an error during password reset:', error);
                    // Extract and display the specific validation error message
                    let errorMessage = "An unexpected error occurred. Please try again.";
                    if (error.response?.data) {
                        // django-rest-framework often returns errors as { field_name: ["error message"] }
                        const errorKey = Object.keys(error.response.data)[0];
                        errorMessage = `${errorKey}: ${error.response.data[errorKey]}`;
                    }
                    setError(`Password reset failed: ${errorMessage}`);
                })
                .finally(() => {
                    setLoading(false);
                });
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={10} sx={{ p: 4 }}>
                <Typography component="h1" variant="h5">Reset Password</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        autoFocus
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
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
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
                        label="Confirm New Password"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        inputProps={{ minLength: 8 }}
                    />
                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!token || loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}
export default ResetPasswordPage;