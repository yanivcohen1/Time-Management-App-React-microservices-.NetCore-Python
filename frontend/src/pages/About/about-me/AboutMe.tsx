import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { useAboutSwitch } from "../AboutSwitchContext";

const AboutMe: React.FC = () => {
  const { aboutMeId } = useParams<{ aboutMeId?: string }>();
  const [searchParams] = useSearchParams();
  const { isOn, setIsOn } = useAboutSwitch();

  const queryId = searchParams.get("id") ?? "N/A";
  const queryName = searchParams.get("name") ?? "N/A";

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsOn(event.target.checked);
  };

  return (
    <div>
      <hr />
      <h4>About Me: User ID: {aboutMeId}</h4>
      <p>
        Query: ID={queryId} name={queryName}
      </p>
      <Stack direction="horizontal" gap={2} className="justify-content-center mt-3">
        <span className="fw-semibold">Shared Switch:</span>
        <Form.Check
          type="switch"
          id="about-me-shared-switch"
          label={isOn ? "On" : "Off"}
          checked={isOn}
          onChange={handleToggle}
        />
      </Stack>
    </div>
  );
};

export default AboutMe;