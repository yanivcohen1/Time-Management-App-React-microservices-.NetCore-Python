import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Stack, FormControlLabel, Switch, Typography, Divider } from '@mui/material';
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
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">About Me: User ID: {aboutMeId}</Typography>
      <Typography variant="body1">
        Query: ID={queryId} name={queryName}
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold">Shared Switch:</Typography>
        <FormControlLabel
          control={<Switch checked={isOn} onChange={handleToggle} />}
          label={isOn ? "On" : "Off"}
        />
      </Stack>
    </div>
  );
};

export default AboutMe;