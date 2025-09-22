import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders Sport Achievements title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Sport Achievements/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders welcome message', () => {
    render(<App />);
    const welcomeElement = screen.getByText(/Добро пожаловать/i);
    expect(welcomeElement).toBeInTheDocument();
  });
});
