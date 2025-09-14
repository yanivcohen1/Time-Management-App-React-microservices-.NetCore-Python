import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './pages/Home/Home';
import { AppProvider } from './context/AppContext';

test('renders learn react link', () => {
  render(
    <AppProvider>
      <Home />
    </AppProvider>
  );
  const linkElement = screen.getByText(/Set AppContext/i);
  expect(linkElement).toBeInTheDocument();
});
