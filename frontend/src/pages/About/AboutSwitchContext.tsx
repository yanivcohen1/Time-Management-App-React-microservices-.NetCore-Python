import React, { createContext, useContext, useState } from "react";

interface AboutSwitchContextValue {
  isOn: boolean;
  setIsOn: (value: boolean) => void;
}

const AboutSwitchContext = createContext<AboutSwitchContextValue | undefined>(undefined);

export const AboutSwitchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOn, setIsOn] = useState<boolean>(false);

  return (
    <AboutSwitchContext.Provider value={{ isOn, setIsOn }}>
      {children}
    </AboutSwitchContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAboutSwitch = (): AboutSwitchContextValue => {
  const context = useContext(AboutSwitchContext);
  if (!context) {
    throw new Error("useAboutSwitch must be used within an AboutSwitchProvider");
  }
  return context;
};
