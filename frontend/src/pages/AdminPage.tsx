// pages/AdminPage.tsx
import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const AdminPage: React.FC = () => {
    const { showToast } = useToast();

    const handleGetReports = async () => {
        try {
            const response = await axios.get('/api/admin/reports');
            showToast(`Reports: ${JSON.stringify(response.data)}`, 'success', 'top-end');
        } catch (error) {
            console.error('Error fetching reports:', error);
            //showToast('Failed to fetch reports', 'danger', 'top-end');
        }
    };

    return (
        <Container className="p-4 text-center">
            <Card>
                <Card.Body>
                    <h1 className="text-3xl font-bold text-green-700">Admin Dashboard</h1>
                    <p className="mt-2">Welcome, admin! You have full access.</p>
                    <Button onClick={handleGetReports} variant="primary" className="mt-3">
                        Get Reports
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminPage;
