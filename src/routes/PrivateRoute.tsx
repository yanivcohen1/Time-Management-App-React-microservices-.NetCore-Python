// routes/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface PrivateRouteProps {
    allowedRoles: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();

    const fromPath = (`${location.pathname}${location.search}${location.hash}`) || '/';

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: fromPath }} />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};
