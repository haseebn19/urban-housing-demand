import {describe, it, expect, afterEach, beforeEach, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import Navbar from '../components/Navbar';
import {ThemeProvider} from '../ThemeContext';

describe('Navbar', () => {
    const mockSetPage = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Start from a saved light theme
        vi.stubGlobal('localStorage', {getItem: vi.fn(() => 'light'), setItem: vi.fn()});
    });

    afterEach(() => vi.unstubAllGlobals());

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

        const toggleButton = screen.getByRole('button', {name: /switch to dark mode/i});
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');

        fireEvent.click(toggleButton);
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(toggleButton).toHaveAccessibleName('Switch to light mode');

        fireEvent.click(toggleButton);
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('displays the application name', () => {
        render(
            <ThemeProvider>
                <Navbar currentPage="pitch" setPage={mockSetPage} />
            </ThemeProvider>
        );

        expect(screen.getByText('Urban Housing Demand')).toBeInTheDocument();
    });
});
