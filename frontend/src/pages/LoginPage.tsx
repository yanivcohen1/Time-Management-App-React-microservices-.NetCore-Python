// pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

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
        <Container className="p-4 text-center">
            <Card>
                <Card.Body>
                    <h1 className="text-2xl font-bold mb-4">Login Page</h1>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Button
                                    onClick={handleLogin}
                                    disabled={loading}
                                    className="w-100"
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                    <div className="mt-4">
                        <p>Demo Credentials:</p>
                        <Button variant="outline-primary" onClick={fillAdminCredentials} className="me-2">
                            Login as Admin
                        </Button>
                        <Button variant="outline-secondary" onClick={fillUserCredentials}>
                            Login as User
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginPage;
