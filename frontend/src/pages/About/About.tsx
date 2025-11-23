import React from "react";
import { Link as RouterLink, useParams, Outlet } from "react-router-dom";
import { Container, Card, CardContent, Stack, FormControlLabel, Switch, Typography, Link } from '@mui/material';
import { AboutSwitchProvider, useAboutSwitch } from "./AboutSwitchContext";

const AboutContent: React.FC = () => {
    const { aboutId } = useParams<{ aboutId: string }>();
    const { isOn, setIsOn } = useAboutSwitch();

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsOn(event.target.checked);
    };

    return (
        <Container sx={{ p: 4, textAlign: 'center' }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom>About</Typography>
                    <Stack spacing={3} alignItems="center">
                        <Link component={RouterLink} to="/about/1/about-me/3?id=1&name=yan" color="primary" underline="hover">About me</Link>
                        <FormControlLabel
                            control={<Switch checked={isOn} onChange={handleToggle} />}
                            label={isOn ? "Switch On" : "Switch Off"}
                        />
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>About: User ID: {aboutId}</Typography>
                    <Outlet />
                </CardContent>
            </Card>
        </Container>
    );
};

const About: React.FC = () => (
    <AboutSwitchProvider>
        <AboutContent />
    </AboutSwitchProvider>
);

export default About;
