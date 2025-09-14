// pages/Unauthorized.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => {
    return (
        <div className="p-4 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="mb-4">You do not have permission to view this page.</p>
            <Link to="/" className="text-blue-500 underline">
                Go back to Home
            </Link>
        </div>
    );
};

export default Unauthorized;
