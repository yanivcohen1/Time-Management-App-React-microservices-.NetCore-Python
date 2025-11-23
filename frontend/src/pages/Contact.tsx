import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Container, Card, CardContent, Typography } from '@mui/material';

const MyComponent: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const aboutId = useParams<{ id: string }>();
    const id = queryParams.get("id"); // string | null
    const name = queryParams.get("name");

    return (
        <Container sx={{ p: 4, textAlign: 'center' }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom>Contact</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Query: ID={id} name={name}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Param: ID={aboutId.id}</Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default MyComponent;
