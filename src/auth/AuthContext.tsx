// auth/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'admin' | 'user' | 'guest';

interface AuthContextType {
    isAuthenticated: boolean;
    role: UserRole;
    login: (role: UserRole) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<UserRole>('guest');

    const login = (newRole: UserRole) => {
        setIsAuthenticated(true);
        setRole(newRole);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRole('guest');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
