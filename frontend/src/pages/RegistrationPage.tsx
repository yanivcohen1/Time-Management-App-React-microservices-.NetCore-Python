import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8} xl={6}>
            <Card className="registration-card mx-auto">
              <Card.Body>
                <h1 className="registration-title">Registration</h1>
                <Form className="registration-form" onSubmit={handleSubmit} noValidate>
                  {status && (
                    <Alert variant={status.variant} className="mb-4">
                      {status.message}
                      {status.variant === 'success' && (
                        <div className="mt-2">
                          <Button variant="outline-light" size="sm" onClick={() => navigate('/login')}>
                            Go to Login
                          </Button>
                        </div>
                      )}
                    </Alert>
                  )}

                  <Form.Group className="mb-3" controlId="registerUsername">
                    <Form.Label>User name</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Your username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={Boolean(errors.username)}
                      className="registration-input"
                    />
                    <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="registerGroupName">
                    <Form.Label>Group name</Form.Label>
                    <Form.Control
                      type="text"
                      name="groupName"
                      placeholder="Your group name"
                      value={formData.groupName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={Boolean(errors.groupName)}
                      className="registration-input"
                    />
                    <Form.Control.Feedback type="invalid">{errors.groupName}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="registerEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={Boolean(errors.email)}
                      className="registration-input"
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="registerPassword">
                    <Form.Label>New password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="New password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={Boolean(errors.password)}
                      className="registration-input"
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    <div className="strength-meter" role="status" aria-live="polite">
                      <span className="strength-label">Password strength:</span>
                      {renderStrengthBars()}
                      <span className="strength-value" style={{ color: strengthColor }}>
                        {formData.password ? strengthLabel : strengthLabels[0]}
                      </span>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="registerConfirmPassword">
                    <Form.Label>New password confirmation</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm the new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={Boolean(errors.confirmPassword)}
                      className="registration-input"
                    />
                    <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      className="registration-submit"
                      disabled={isSubmitDisabled}
                    >
                      Register
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegistrationPage;
