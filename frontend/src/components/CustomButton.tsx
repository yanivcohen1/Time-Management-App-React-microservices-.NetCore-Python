// src/components/CustomButton.tsx
import React from "react";

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
  const baseStyle = "btn";
  const variants: Record<ButtonVariant, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
  };

  return (
    <button type={type} className={`${baseStyle} ${variants[variant]}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default CustomButton;
