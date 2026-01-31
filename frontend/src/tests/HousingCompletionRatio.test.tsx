import {describe, it, expect, vi, beforeAll} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import {ThemeContext} from '../ThemeContext';
import HousingCompletionRatio from '../components/HousingCompletionRatio';

// Mock API response
vi.mock('../services/housingService', () => ({
  getHousingCompletionRatios: vi.fn().mockResolvedValue([
    {city: 'Hamilton', year: 2023, month: 1, ratio: 0.85},
    {city: 'Hamilton', year: 2023, month: 2, ratio: 0.88},
    {city: 'Toronto', year: 2023, month: 1, ratio: 0.82},
    {city: 'Toronto', year: 2023, month: 2, ratio: 0.80},
  ]),
}));

beforeAll(() => {
  class ResizeObserver {
    observe(): void { /* noop */ }
    unobserve(): void { /* noop */ }
    disconnect(): void { /* noop */ }
  }
  vi.stubGlobal('ResizeObserver', ResizeObserver);
});

describe('HousingCompletionRatio Component', () => {
  it('renders the chart container without crashing', async () => {
    render(
      <ThemeContext.Provider value={{theme: 'light', toggleTheme: vi.fn()}}>
        <HousingCompletionRatio />
      </ThemeContext.Provider>
    );

    // Ensure the component is in the DOM
    const container = await screen.findByTestId('housing-completion-ratio');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('chart-card');

    // Wait for the loading text to disappear
    await waitFor(() => expect(screen.queryByText(/Loading data/i)).not.toBeInTheDocument());
  });

  it('renders with dark theme', async () => {
    render(
      <ThemeContext.Provider value={{theme: 'dark', toggleTheme: vi.fn()}}>
        <HousingCompletionRatio />
      </ThemeContext.Provider>
    );

    const container = await screen.findByTestId('housing-completion-ratio');
    expect(container).toBeInTheDocument();
  });
});
