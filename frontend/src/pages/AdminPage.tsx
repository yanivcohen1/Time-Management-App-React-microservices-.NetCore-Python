// pages/AdminPage.tsx
import React from 'react';
import { Container, Card, CardContent, Button, Typography } from '@mui/material';
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
        <Container sx={{ p: 4, textAlign: 'center' }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'success.main' }}>Admin Dashboard</Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>Welcome, admin! You have full access.</Typography>
                    <Button onClick={handleGetReports} variant="contained" color="primary" sx={{ mt: 3 }}>
                        Get Reports
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
};

export default AdminPage;
