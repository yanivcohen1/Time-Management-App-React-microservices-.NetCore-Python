// pages/UserPage.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { getGlobal, setGlobal } from "../utils/storage"; // for data storage
import { useAppContext } from "../context/AppContext"; // for events updates
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

const UserPage: React.FC = () => {
    const { user, setUser } = useAppContext();
    const [global, setGlobalstate] = useState<string>(getGlobal);
    return (
        <Container className="p-4 text-center">
            <Card>
                <Card.Body>
                    <h1 className="text-3xl font-bold text-indigo-700">User Page</h1>
                    <p className="mt-2">Welcome, user! You have limited access.</p>
                    <p>User msg: {user ?? "No user msg"}</p>
                    <p>User global msg: {global ?? "No user msg"}</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserPage;
