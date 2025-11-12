// src/components/CustomSelect.tsx
import React from "react";
import { useTheme } from "../hooks/useTheme";

export interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, label }) => {
  const theme = useTheme();
  const isDarkTheme = theme === 'dark';

  return (
    <div className="d-flex flex-column gap-2">
      {label && <label className={`form-label fw-semibold ${isDarkTheme ? 'text-light' : 'text-muted'}`}>{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;
