import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders splash screen on initial load', () => {
    render(<App />);
    expect(screen.getByText('Begin Verification')).toBeInTheDocument();
    expect(screen.getByText(/Pixl/)).toBeInTheDocument();
    expect(screen.getByText('Secure Identity Verification')).toBeInTheDocument();
  });

  it('navigates to liveness step when Begin is clicked', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Begin Verification'));
    await waitFor(() => {
      expect(screen.getByText('Liveness Check')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('shows feature pills on splash', () => {
    render(<App />);
    expect(screen.getByText('Face ID')).toBeInTheDocument();
    expect(screen.getByText('Biometric')).toBeInTheDocument();
    expect(screen.getByText('Secure')).toBeInTheDocument();
  });
});
