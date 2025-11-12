import React from "react";
import { Link, useParams, Outlet } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { AboutSwitchProvider, useAboutSwitch } from "./AboutSwitchContext";

const AboutContent: React.FC = () => {
    const { aboutId } = useParams<{ aboutId: string }>();
    const { isOn, setIsOn } = useAboutSwitch();

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsOn(event.target.checked);
    };

    return (
        <Container className="p-4 text-center">
            <Card>
                <Card.Body>
                    <h1>About</h1>
                    <Stack gap={3} className="align-items-center">
                        <Link to="about-me/2">About me</Link>
                        <Form.Check
                            type="switch"
                            id="about-shared-switch"
                            label={isOn ? "Switch On" : "Switch Off"}
                            checked={isOn}
                            onChange={handleToggle}
                        />
                    </Stack>
                    <h4 className="text-xl font-bold">About: User ID: {aboutId}</h4>
                    <Outlet />
                </Card.Body>
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
