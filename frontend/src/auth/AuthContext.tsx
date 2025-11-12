// auth/AuthContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { savelocalStorage, getlocalStorage, removelocaStorage } from '../utils/storage';
import axios from 'axios';

type UserRole = 'admin' | 'user' | 'guest';

type AuthData = {
    isAuthenticated: boolean;
    role: UserRole;
};
const AUTH_KEY = 'auth';

export const JWT_KEY = 'jwt';

interface AuthContextType {
    isAuthenticated: boolean;
    role: UserRole;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const stored = getlocalStorage<AuthData>(AUTH_KEY);
        return stored ? stored.isAuthenticated : false;
    });
    const [role, setRole] = useState<UserRole>(() => {
        const stored = getlocalStorage<AuthData>(AUTH_KEY);
        return stored ? stored.role : 'guest';
    });

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            const { access_token, role } = response.data;
            if (access_token) {
                savelocalStorage(JWT_KEY, access_token);
            }
            // Use role from response, normalized to lowercase
            const userRole: UserRole = role.toLowerCase() as UserRole;
            setIsAuthenticated(true);
            setRole(userRole);
            savelocalStorage(AUTH_KEY, { isAuthenticated: true, role: userRole } as AuthData);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRole('guest');
        savelocalStorage(AUTH_KEY, { isAuthenticated: false, role: 'guest' } as AuthData);
        removelocaStorage(JWT_KEY);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
