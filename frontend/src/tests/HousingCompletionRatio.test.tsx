import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import {ThemeContext} from "../ThemeContext";
import HousingCompletionRatio from "../components/HousingCompletionRatio";
import {getHousingCompletionRatios} from "../services/housingService";

// Mock API response
jest.mock("../services/housingService", () => ({
  getHousingCompletionRatios: jest.fn().mockResolvedValue([
    {city: "Hamilton", year: 2023, month: 1, ratio: 0.85},
    {city: "Hamilton", year: 2023, month: 2, ratio: 0.88},
    {city: "Toronto", year: 2023, month: 1, ratio: 0.82},
    {city: "Toronto", year: 2023, month: 2, ratio: 0.80},
  ]),
}));

beforeAll(() => {
  class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
  }
  // @ts-ignore
  global.ResizeObserver = ResizeObserver;
});

describe("HousingCompletionRatio Component", () => {
  it("renders the chart container and updates theme context without crashing", async () => {
    const {rerender} = render(
      <ThemeContext.Provider value={{theme: "light", toggleTheme: jest.fn()}}>
        <HousingCompletionRatio />
      </ThemeContext.Provider>
    );

    // Ensure the component is in the DOM
    const container = await screen.findByTestId("housing-completion-ratio");
    expect(container).toBeInTheDocument();

    // Wait for the loading text to disappear
    await waitFor(() => expect(screen.queryByText(/Loading chart data/i)).not.toBeInTheDocument());

    // Re-render with dark theme
    rerender(
      <ThemeContext.Provider value={{theme: "dark", toggleTheme: jest.fn()}}>
        <HousingCompletionRatio />
      </ThemeContext.Provider>
    );

    // Ensure it still renders
    expect(await screen.findByTestId("housing-completion-ratio")).toBeInTheDocument();

    // Mock CSS variable (JSDOM limitation)
    document.documentElement.style.setProperty("--background-color", "rgb(28, 28, 28)");

    // Check background color
    expect(container).toHaveStyle("background-color: rgb(28, 28, 28)");
  });
});
