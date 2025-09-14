import React from "react";
import { Link } from "react-router-dom";
import { useParams, Outlet } from "react-router-dom";

const About: React.FC = () => {
    const { aboutId } = useParams<{ aboutId: string }>();

    return (
        <div className="p-4">
            <h1>About</h1>
            <Link to="about-me/2">About me</Link>
            <h3 className="text-xl font-bold">User ID: {aboutId}</h3>
            <Outlet /> {/* <- renders <Settings /> when path is /dashboard/settings */}
        </div>
    );
};

export default About;
