// pages/UserPage.tsx
import { useState } from 'react';
import { getGlobal } from "../utils/storage"; // for data storage
import { useAppContext } from "../context/AppContext"; // for events updates
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const UserPage: React.FC = () => {
    const { user } = useAppContext();
    const [global] = useState<string>(getGlobal);
    return (
        <Container sx={{ p: 4, textAlign: 'center' }}>
            <Card>
                <CardContent>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'indigo.700' }}>
                        User Page
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Welcome, user! You have limited access.
                    </Typography>
                    <Typography variant="body1">User msg: {user ?? "No user msg"}</Typography>
                    <Typography variant="body1">User global msg: {global ?? "No user msg"}</Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default UserPage;
