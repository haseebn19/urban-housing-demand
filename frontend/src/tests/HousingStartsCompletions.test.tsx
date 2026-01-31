import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import HousingStartsCompletions from "../components/HousingStartsCompletions";
import {ThemeProvider} from "../ThemeContext";
import * as housingService from "../services/housingService";

// Mock ResizeObserver for Chart.js
beforeAll(() => {
  class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
  }
  // @ts-ignore
  global.ResizeObserver = ResizeObserver;
});

// Mock the housing service
jest.mock("../services/housingService");
const mockedService = housingService as jest.Mocked<typeof housingService>;

describe("HousingStartsCompletions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "light"),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  test("renders with Hamilton city prop", async () => {
    mockedService.getHousingTotalStartsCompletions.mockResolvedValue([
      {city: "Hamilton", year: 2023, month: 1, totalStarts: 100, totalCompletions: 80},
    ]);

    render(
      <ThemeProvider>
        <HousingStartsCompletions city="Hamilton" />
      </ThemeProvider>
    );

    expect(screen.getByText(/Housing Starts and Completions \(Hamilton\)/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedService.getHousingTotalStartsCompletions).toHaveBeenCalledTimes(1);
    });
  });

  test("renders with Toronto city prop", async () => {
    mockedService.getHousingTotalStartsCompletions.mockResolvedValue([
      {city: "Toronto", year: 2023, month: 1, totalStarts: 200, totalCompletions: 150},
    ]);

    render(
      <ThemeProvider>
        <HousingStartsCompletions city="Toronto" />
      </ThemeProvider>
    );

    expect(screen.getByText(/Housing Starts and Completions \(Toronto\)/i)).toBeInTheDocument();
  });

  test("shows loading state initially", () => {
    mockedService.getHousingTotalStartsCompletions.mockImplementation(
      () => new Promise(() => { }) // Never resolves
    );

    render(
      <ThemeProvider>
        <HousingStartsCompletions city="Hamilton" />
      </ThemeProvider>
    );

    expect(screen.getByText(/Loading chart data.../i)).toBeInTheDocument();
  });

  test("handles empty data gracefully", async () => {
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

  test("filters data correctly by city", async () => {
    mockedService.getHousingTotalStartsCompletions.mockResolvedValue([
      {city: "Hamilton", year: 2023, month: 1, totalStarts: 100, totalCompletions: 80},
      {city: "Toronto", year: 2023, month: 1, totalStarts: 200, totalCompletions: 150},
    ]);

    render(
      <ThemeProvider>
        <HousingStartsCompletions city="Hamilton" />
      </ThemeProvider>
    );

    // Component should render without error and show Hamilton data
    await waitFor(() => {
      const container = screen.getByTestId("housing-starts-hamilton");
      expect(container).toBeInTheDocument();
    });
  });

  test("applies dark theme correctly", async () => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "dark"),
        setItem: jest.fn(),
      },
      writable: true,
    });

    mockedService.getHousingTotalStartsCompletions.mockResolvedValue([
      {city: "Hamilton", year: 2023, month: 1, totalStarts: 100, totalCompletions: 80},
    ]);

    render(
      <ThemeProvider>
        <HousingStartsCompletions city="Hamilton" />
      </ThemeProvider>
    );

    const container = screen.getByTestId("housing-starts-hamilton");
    expect(container).toHaveStyle("background-color: #1c1c1c");
  });

  test("applies light theme correctly", async () => {
    mockedService.getHousingTotalStartsCompletions.mockResolvedValue([
      {city: "Hamilton", year: 2023, month: 1, totalStarts: 100, totalCompletions: 80},
    ]);

    render(
      <ThemeProvider>
        <HousingStartsCompletions city="Hamilton" />
      </ThemeProvider>
    );

    const container = screen.getByTestId("housing-starts-hamilton");
    expect(container).toHaveStyle("background-color: #ffffff");
  });
});
