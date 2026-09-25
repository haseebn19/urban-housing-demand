import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ThemeContext} from '../ThemeContext';
import ProductPitch from '../components/ProductPitch';

describe('ProductPitch Component', () => {
  it('renders the component and applies correct styles for light theme', () => {
    render(
      <ThemeContext.Provider value={{theme: 'light', toggleTheme: vi.fn()}}>
        <ProductPitch />
      </ThemeContext.Provider>
    );

    const container = screen.getByTestId('product-pitch');

    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('pitch', 'light');

    // Check headings
    expect(screen.getByRole('heading', {name: /Urban Housing Demand/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: /Key Objectives/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: /Our Approach/i})).toBeInTheDocument();
  });

  it('renders the component and applies correct styles for dark theme', () => {
    render(
      <ThemeContext.Provider value={{theme: 'dark', toggleTheme: vi.fn()}}>
        <ProductPitch />
      </ThemeContext.Provider>
    );

    const container = screen.getByTestId('product-pitch');

    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('pitch', 'dark');

    // Check headings
    expect(screen.getByRole('heading', {name: /Urban Housing Demand/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: /Key Objectives/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: /Our Approach/i})).toBeInTheDocument();
  });
});
