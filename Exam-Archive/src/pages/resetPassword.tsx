import React, { useState, useEffect, type JSX } from 'react';
import { TextField, Button, Typography, Box, Container, Paper, Alert } from "@mui/material";
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import IconButton from '@mui/material/IconButton';
import { useNavigate, useLocation } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import API_URL from "../context/apiConfig";

// Extend AxiosRequestConfig to include retry properties
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    retry?: number;
    retryDelay?: number;
    __retryCount?: number;
}

// Add a retry interceptor to axios
axios.interceptors.response.use(undefined, (err: AxiosError) => {
    const config = err.config as CustomAxiosRequestConfig;
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
    const backoff = new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, config.retryDelay || 1000);
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(() => axios(config));
});

interface ApiErrorResponse {
    [key: string]: string[] | string;
}

function ResetPasswordPage(): JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError("No password reset token found. Please request a new one.");
        }
    }, [location]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
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

        try {
            const response = await axios.post(`${API_URL}/api/password-reset/confirm/`, {
                password: password,
                token: token,
            }, {
                retry: 3, // Number of retries
                retryDelay: 1000, // Delay between retries in ms
            } as CustomAxiosRequestConfig);

            console.log('Password reset successful', response.data);
            alert('Password has been reset successfully! You can now log in.');
            navigate('/login');
        } catch (error) {
            console.error('There was an error during password reset:', error);
            
            // Extract and display the specific validation error message
            let errorMessage = "An unexpected error occurred. Please try again.";
            
            if (axios.isAxiosError(error) && error.response?.data) {
                const errorData = error.response.data as ApiErrorResponse;
                // django-rest-framework often returns errors as { field_name: ["error message"] }
                const errorKey = Object.keys(errorData)[0];
                const errorValue = errorData[errorKey];
                const message = Array.isArray(errorValue) ? errorValue[0] : errorValue;
                errorMessage = `${errorKey}: ${message}`;
            }
            
            setError(`Password reset failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setConfirmPassword(e.target.value);
    };

    const togglePasswordVisibility = (): void => {
        setShowPassword(!showPassword);
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
                        onChange={handlePasswordChange}
                        autoComplete="new-password"
                        autoFocus
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={togglePasswordVisibility}
                                        edge="end"
                                        aria-label="toggle password visibility"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{ minLength: 8 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="confirmPassword"
                        label="Confirm New Password"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        autoComplete="new-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={togglePasswordVisibility}
                                        edge="end"
                                        aria-label="toggle password visibility"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{ minLength: 8 }}
                    />
                    
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!token || loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    
                </Box>
            </Paper>
        </Container>
    );
}

export default ResetPasswordPage;