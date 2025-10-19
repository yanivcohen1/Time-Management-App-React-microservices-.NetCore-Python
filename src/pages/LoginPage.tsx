// pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

const LoginPage: React.FC = () => {
    const { isAuthenticated, login } = useAuth();
    const [role, setRole] = useState<'user' | 'admin'>('user');
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = () => {
        login(role);
        const from = (location.state as { from?: string } | undefined)?.from || '/';
        navigate(from, { replace: true });
        // if (role === 'admin') {
        //     navigate('/admin'); // redirect to the Admin page
        // } else {
        //     navigate('/user'); // redirect to the User page
        // }
    };

    return (
        <Container className="p-4 text-center">
            <Card>
                <Card.Body>
                    <h1 className="text-2xl font-bold mb-4">Login Page</h1>

                    <div className="mb-4">
                        <label htmlFor="role" className="block mb-2 font-semibold">
                            Select Role:
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                            className="border px-3 py-2 rounded"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Login as {role}
                    </button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginPage;
