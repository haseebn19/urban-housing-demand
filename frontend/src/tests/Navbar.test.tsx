import {describe, it, expect, beforeEach, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import Navbar from '../components/Navbar';
import {ThemeProvider} from '../ThemeContext';

describe('Navbar', () => {
  const mockSetPage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'light'),
        setItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('renders all navigation links', () => {
    render(
      <ThemeProvider>
        <Navbar currentPage="pitch" setPage={mockSetPage} />
      </ThemeProvider>
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Housing')).toBeInTheDocument();
    expect(screen.getByText('Occupations')).toBeInTheDocument();
    expect(screen.getByText('Family Types')).toBeInTheDocument();
    expect(screen.getByText('Immigration')).toBeInTheDocument();
  });

  it('calls setPage when navigation buttons are clicked', () => {
    render(
      <ThemeProvider>
        <Navbar currentPage="pitch" setPage={mockSetPage} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Housing'));
    expect(mockSetPage).toHaveBeenCalledWith('starts');

    fireEvent.click(screen.getByText('Occupations'));
    expect(mockSetPage).toHaveBeenCalledWith('occupations');
  });

  it('theme toggle button switches between light and dark mode', () => {
    render(
      <ThemeProvider>
        <Navbar currentPage="pitch" setPage={mockSetPage} />
      </ThemeProvider>
    );

    // Find the theme toggle button by aria-label
    const toggleButton = screen.getByRole('button', {name: /switch to dark mode/i});

    // Default theme is light
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    // Click to switch to dark mode
    fireEvent.click(toggleButton);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // Click back to light mode
    fireEvent.click(toggleButton);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('displays brand logo', () => {
    render(
      <ThemeProvider>
        <Navbar currentPage="pitch" setPage={mockSetPage} />
      </ThemeProvider>
    );

    expect(screen.getByText('UHD')).toBeInTheDocument();
  });
});
