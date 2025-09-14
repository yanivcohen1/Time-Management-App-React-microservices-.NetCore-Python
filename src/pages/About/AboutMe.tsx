import { useParams } from "react-router-dom";
const AboutMe: React.FC = () => {
    const { aboutMeId } = useParams<{ aboutMeId: string }>();

    return (
    <div>
      <h1>About me: User ID: {aboutMeId}</h1>
    </div>
  );
};

export default AboutMe;