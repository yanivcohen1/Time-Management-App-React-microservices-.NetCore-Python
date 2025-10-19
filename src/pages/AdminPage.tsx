// pages/AdminPage.tsx
import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

const AdminPage: React.FC = () => {
    return (
        <Container className="p-4 text-center">
            <Card>
                <Card.Body>
                    <h1 className="text-3xl font-bold text-green-700">Admin Dashboard</h1>
                    <p className="mt-2">Welcome, admin! You have full access.</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminPage;
