// src/components/CustomButton.tsx
import React from "react";
import { Button } from "@mui/material";

type ButtonVariant = "primary" | "secondary" | "danger";

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  type = "button",
  variant = "primary",
}) => {
  const getMuiColor = (v: ButtonVariant): "primary" | "secondary" | "error" => {
    switch (v) {
      case "primary": return "primary";
      case "secondary": return "secondary";
      case "danger": return "error";
      default: return "primary";
    }
  };

  return (
    <Button
      type={type}
      variant="contained"
      color={getMuiColor(variant)}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
