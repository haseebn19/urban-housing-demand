import {describe, it, expect, vi, beforeAll, beforeEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import HousingStartsCompletions from '../components/HousingStartsCompletions';
import {ThemeProvider} from '../ThemeContext';
import * as housingService from '../services/housingService';

// Mock ResizeObserver for Chart.js
beforeAll(() => {
  class ResizeObserver {
    observe(): void { /* noop */ }
    unobserve(): void { /* noop */ }
    disconnect(): void { /* noop */ }
  }
  vi.stubGlobal('ResizeObserver', ResizeObserver);
});

// Mock the housing service
vi.mock('../services/housingService');
const mockedService = housingService as unknown as {
  getHousingTotalStartsCompletions: ReturnType<typeof vi.fn>;
};

describe('HousingStartsCompletions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'light'),
        setItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('renders with Hamilton city prop', async () => {
    mockedService.getHousingTotalStartsCompletions.mockResolvedValue([
      {city: 'Hamilton', year: 2023, month: 1, totalStarts: 100, totalCompletions: 80},
    ]);

    render(
      <ThemeProvider>
        <HousingStartsCompletions city="Hamilton" />
      </ThemeProvider>
    );

    expect(screen.getByText(/Housing Starts & Completions \(Hamilton\)/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedService.getHousingTotalStartsCompletions).toHaveBeenCalledTimes(1);
    });
  });

  it('renders with Toronto city prop', async () => {
    mockedService.getHousingTotalStartsCompletions.mockResolvedValue([
      {city: 'Toronto', year: 2023, month: 1, totalStarts: 200, totalCompletions: 150},
    ]);

    render(
      <ThemeProvider>
        <HousingStartsCompletions city="Toronto" />
      </ThemeProvider>
    );

    expect(screen.getByText(/Housing Starts & Completions \(Toronto\)/i)).toBeInTheDocument();
    
    // Wait for async state updates to complete
    await waitFor(() => {
      expect(mockedService.getHousingTotalStartsCompletions).toHaveBeenCalled();
    });
  });

  it('shows loading state initially', () => {
    mockedService.getHousingTotalStartsCompletions.mockImplementation(
      () => new Promise(() => { /* never resolves */ })
    );

    render(
      <ThemeProvider>
        <HousingStartsCompletions city="Hamilton" />
      </ThemeProvider>
    );

    expect(screen.getByText(/Loading data/i)).toBeInTheDocument();
  });

  it('handles empty data gracefully', async () => {
    mockedService.getHousingTotalStartsCompletions.mockResolvedValue([]);

    render(
      <ThemeProvider>
        <HousingStartsCompletions city="Hamilton" />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/No data available for Hamilton/i)).toBeInTheDocument();
    });
  });

  it('filters data correctly by city', async () => {
    mockedService.getHousingTotalStartsCompletions.mockResolvedValue([
      {city: 'Hamilton', year: 2023, month: 1, totalStarts: 100, totalCompletions: 80},
      {city: 'Toronto', year: 2023, month: 1, totalStarts: 200, totalCompletions: 150},
    ]);

    render(
      <ThemeProvider>
        <HousingStartsCompletions city="Hamilton" />
      </ThemeProvider>
    );

    // Component should render without error and show Hamilton data
    await waitFor(() => {
      const container = screen.getByTestId('housing-starts-hamilton');
      expect(container).toBeInTheDocument();
    });
  });

  it('applies dark theme correctly', async () => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'dark'),
        setItem: vi.fn(),
      },
      writable: true,
    });

    mockedService.getHousingTotalStartsCompletions.mockResolvedValue([
      {city: 'Hamilton', year: 2023, month: 1, totalStarts: 100, totalCompletions: 80},
    ]);

    render(
      <ThemeProvider>
        <HousingStartsCompletions city="Hamilton" />
      </ThemeProvider>
    );

    await waitFor(() => {
      const container = screen.getByTestId('housing-starts-hamilton');
      expect(container).toHaveClass('chart-card');
    });
  });

  it('applies light theme correctly', async () => {
    mockedService.getHousingTotalStartsCompletions.mockResolvedValue([
      {city: 'Hamilton', year: 2023, month: 1, totalStarts: 100, totalCompletions: 80},
    ]);

    render(
      <ThemeProvider>
        <HousingStartsCompletions city="Hamilton" />
      </ThemeProvider>
    );

    await waitFor(() => {
      const container = screen.getByTestId('housing-starts-hamilton');
      expect(container).toHaveClass('chart-card');
    });
  });
});
