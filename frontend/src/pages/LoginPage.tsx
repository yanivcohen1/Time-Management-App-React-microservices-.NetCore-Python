// pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Box
} from '@mui/material';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please enter username and password');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await login(username, password);
            const from = (location.state as { from?: string } | undefined)?.from || '/';
            navigate(from, { replace: true });
        } catch {
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const fillAdminCredentials = () => {
        setUsername('admin@example.com');
        setPassword('Admin123!');
    };

    const fillUserCredentials = () => {
        setUsername('user@example.com');
        setPassword('User123!');
    };

    return (
        <Container sx={{ p: 4, textAlign: 'center' }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
                        Login Page
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box component="form">
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                id="username"
                                label="Username"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Button
                                variant="contained"
                                onClick={handleLogin}
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="body1">Demo Credentials:</Typography>
                        <Button variant="outlined" onClick={fillAdminCredentials} sx={{ mr: 2 }}>
                            Login as Admin
                        </Button>
                        <Button variant="outlined" onClick={fillUserCredentials}>
                            Login as User
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default LoginPage;
