import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Grid
} from '@mui/material';
import { getlocalStorage, savelocalStorage } from '../utils/storage';
import { useTheme } from '../hooks/useTheme';
import './RegistrationPage.css';

interface RegistrationFormData {
  username: string;
  groupName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisteredUser {
  username: string;
  groupName: string;
  email: string;
  password: string;
  createdAt: string;
}

type FormErrors = Partial<Record<keyof RegistrationFormData, string>>;
type FormTouched = Partial<Record<keyof RegistrationFormData, boolean>>;

const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

const getStrengthColor = (strength: number): string => {
  if (strength <= 1) return '#dc3545';
  if (strength === 2) return '#fd7e14';
  if (strength === 3) return '#ffc107';
  if (strength === 4) return '#0dcaf0';
  return '#198754';
};

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: '',
    groupName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [status, setStatus] = useState<{ variant: 'success' | 'danger'; message: string } | null>(null);

  const passwordStrength = useMemo(() => calculatePasswordStrength(formData.password), [formData.password]);
  const strengthColor = useMemo(() => getStrengthColor(passwordStrength), [passwordStrength]);

  const validateField = (field: keyof RegistrationFormData, value: string): string | undefined => {
    switch (field) {
      case 'username': {
        const trimmed = value.trim();
        if (!trimmed) return 'User name is required.';
        if (trimmed.length < 3) return 'User name must be at least 3 characters.';
        return undefined;
      }
      case 'groupName': {
        const trimmed = value.trim();
        if (!trimmed) return 'Group name is required.';
        return undefined;
      }
      case 'email': {
        const trimmed = value.trim();
        if (!trimmed) return 'Email is required.';
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
        if (!emailRegex.test(trimmed)) return 'Enter a valid email address.';
        return undefined;
      }
      case 'password': {
        if (!value) return 'New password is required.';
        if (value.length < 8) return 'Password must be at least 8 characters long.';
        if (calculatePasswordStrength(value) < 3) return 'Choose a stronger password.';
        return undefined;
      }
      case 'confirmPassword': {
        if (!value) return 'Please confirm the new password.';
        if (value !== formData.password) return 'Passwords do not match.';
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const updateField = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const fieldError = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: fieldError }));
      if (field === 'password' && touched.confirmPassword) {
        const confirmError = validateField('confirmPassword', formData.confirmPassword);
        setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    updateField(name as keyof RegistrationFormData, value);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const fieldName = name as keyof RegistrationFormData;
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const fieldError = validateField(fieldName, formData[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: fieldError }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof RegistrationFormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    setTouched({ username: true, groupName: true, email: true, password: true, confirmPassword: true });
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({ username: '', groupName: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setTouched({});
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!validateForm()) return;

    const existingUsers = getlocalStorage<RegisteredUser[]>('registeredUsers') ?? [];
    const usernameTaken = existingUsers.some(user => user.username.toLowerCase() === formData.username.trim().toLowerCase());
    const emailTaken = existingUsers.some(user => user.email.toLowerCase() === formData.email.trim().toLowerCase());

    if (usernameTaken || emailTaken) {
      const message = usernameTaken && emailTaken
        ? 'User name and email are already registered.'
        : usernameTaken
          ? 'That user name is already registered.'
          : 'That email is already registered.';
      setStatus({ variant: 'danger', message });
      return;
    }

    const newUser: RegisteredUser = {
      username: formData.username.trim(),
      groupName: formData.groupName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      createdAt: new Date().toISOString()
    };

    savelocalStorage('registeredUsers', [...existingUsers, newUser]);
    resetForm();
    setStatus({ variant: 'success', message: 'Registration complete! You can log in with your new credentials.' });
  };

  const renderStrengthBars = () => (
    <div className="strength-bars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < passwordStrength;
        return (
          <span
            key={index}
            className={`strength-bar${filled ? ' filled' : ''}`}
            style={{ backgroundColor: filled ? strengthColor : undefined }}
          />
        );
      })}
    </div>
  );

  const strengthLabel = strengthLabels[Math.max(passwordStrength - 1, 0)] ?? strengthLabels[0];

  const hasErrors = Object.values(errors).some(Boolean);
  const isSubmitDisabled = hasErrors || (Object.values(formData) as string[]).some(value => !value.trim());

  return (
    <div className={`registration-page ${theme === 'dark' ? 'dark' : ''}`} data-bs-theme={theme}>
      <Container>
        <Grid container justifyContent="center">
          <Grid size={{ xs: 12, md: 10, lg: 8, xl: 6 }}>
            <Card className="registration-card mx-auto">
              <CardContent>
                <Typography variant="h4" component="h1" className="registration-title" gutterBottom>
                  Registration
                </Typography>
                <Box component="form" className="registration-form" onSubmit={handleSubmit} noValidate>
                  {status && (
                    <Alert severity={status.variant === 'danger' ? 'error' : status.variant} className="mb-4">
                      {status.message}
                      {status.variant === 'success' && (
                        <Box sx={{ mt: 2 }}>
                          <Button variant="outlined" size="small" onClick={() => navigate('/login')}>
                            Go to Login
                          </Button>
                        </Box>
                      )}
                    </Alert>
                  )}

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      id="registerUsername"
                      label="User name"
                      name="username"
                      placeholder="Your username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.username)}
                      helperText={errors.username}
                      className="registration-input"
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      id="registerGroupName"
                      label="Group name"
                      name="groupName"
                      placeholder="Your group name"
                      value={formData.groupName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.groupName)}
                      helperText={errors.groupName}
                      className="registration-input"
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      id="registerEmail"
                      label="Email"
                      type="email"
                      name="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.email)}
                      helperText={errors.email}
                      className="registration-input"
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      id="registerPassword"
                      label="New password"
                      type="password"
                      name="password"
                      placeholder="New password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.password)}
                      helperText={errors.password}
                      className="registration-input"
                    />
                    <div className="strength-meter" role="status" aria-live="polite">
                      <span className="strength-label">Password strength:</span>
                      {renderStrengthBars()}
                      <span className="strength-value" style={{ color: strengthColor }}>
                        {formData.password ? strengthLabel : strengthLabels[0]}
                      </span>
                    </div>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <TextField
                      fullWidth
                      id="registerConfirmPassword"
                      label="New password confirmation"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm the new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.confirmPassword)}
                      helperText={errors.confirmPassword}
                      className="registration-input"
                    />
                  </Box>

                  <Box sx={{ display: 'grid' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="registration-submit"
                      disabled={isSubmitDisabled}
                    >
                      Register
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default RegistrationPage;
