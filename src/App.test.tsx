import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './pages/Home/Home';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './auth/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Mock axios to avoid external calls
jest.mock('axios');

// Mock react-router-dom hooks and components for testing without real Router context
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => () => {},
  useLocation: () => ({ pathname: '/', search: '', hash: '', state: null, key: 'test' }),
  Outlet: () => null,
}));

test('renders Home Set AppContext button', () => {
  render(
    <AppProvider>
      <AuthProvider>
        <ToastProvider>
          <MemoryRouter>
            <Home onToggleCookieBanner={() => {}} isCookieBannerVisible={false} />
          </MemoryRouter>
        </ToastProvider>
      </AuthProvider>
    </AppProvider>
  );
  
  const linkElement = screen.getByText(/Set AppContext/i);
  expect(linkElement).toBeInTheDocument();
});

test('clicking Set global User to Alice button updates global storage display', () => {
  render(
    <AppProvider>
      <AuthProvider>
        <ToastProvider>
          <MemoryRouter>
            <Home onToggleCookieBanner={() => {}} isCookieBannerVisible={false} />
          </MemoryRouter>
        </ToastProvider>
      </AuthProvider>
    </AppProvider>
  );

  // Find the button
  const button = screen.getByText(/Set global User to Alice/i);
  // const button = screen.getByTestId('my-button'); <button data-testid="my-button" ...>
  expect(button).toBeInTheDocument();

  // Click the button
  fireEvent.click(button);

  // Check that the display text updates
  const displayText = screen.getByText(/Global Storage: global Alice/i);
  expect(displayText).toBeInTheDocument();
});
