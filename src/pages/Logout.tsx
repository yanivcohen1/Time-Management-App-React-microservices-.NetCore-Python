// pages/Logout.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Logout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate('/login'); // or redirect wherever you want
    }, [logout, navigate]);

    return null; // or a loader/spinner if you want
};

export default Logout;
