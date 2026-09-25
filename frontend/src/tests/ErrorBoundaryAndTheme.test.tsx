import {describe, it, expect, vi, afterEach, onTestFinished} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';
import {ThemeProvider, useTheme} from '../ThemeContext';

function Broken(): never {
    throw new Error('chart exploded');
}

function ThemeButton() {
    const {theme, toggleTheme} = useTheme();
    return (
        <button type="button" onClick={toggleTheme}>
            {theme}
        </button>
    );
}

function stubStorage(saved: string | null) {
    const storage = {getItem: vi.fn(() => saved), setItem: vi.fn()};
    vi.stubGlobal('localStorage', storage);
    return storage;
}

function stubSystemTheme(dark: boolean) {
    vi.stubGlobal('matchMedia', (query: string) => ({matches: dark && query.includes('dark')}));
}

afterEach(() => vi.unstubAllGlobals());

describe('ErrorBoundary', () => {
    it('shows the error and a way to recover when a child fails to render', () => {
        // React reports the error it catches; keep the expected one out of the test output
        vi.spyOn(console, 'error').mockImplementation(() => {});
        const hideError = (event: ErrorEvent) => event.preventDefault();
        window.addEventListener('error', hideError);
        onTestFinished(() => window.removeEventListener('error', hideError));

        render(
            <ErrorBoundary>
                <Broken />
            </ErrorBoundary>
        );

        expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
        expect(screen.getByText('Error: chart exploded')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Refresh Page'})).toBeInTheDocument();
    });
});

describe('ThemeProvider', () => {
    it('follows the system theme until the user chooses one, then saves the choice', () => {
        const storage = stubStorage(null);
        stubSystemTheme(true);

        render(
            <ThemeProvider>
                <ThemeButton />
            </ThemeProvider>
        );

        expect(screen.getByRole('button')).toHaveTextContent('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(storage.setItem).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button'));

        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        expect(storage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('uses the saved choice over the system theme', () => {
        stubStorage('light');
        stubSystemTheme(true);

        render(
            <ThemeProvider>
                <ThemeButton />
            </ThemeProvider>
        );

        expect(screen.getByRole('button')).toHaveTextContent('light');
    });

    it('ignores a saved value that is not a theme', () => {
        stubStorage('purple');
        stubSystemTheme(false);

        render(
            <ThemeProvider>
                <ThemeButton />
            </ThemeProvider>
        );

        expect(screen.getByRole('button')).toHaveTextContent('light');
    });
});
