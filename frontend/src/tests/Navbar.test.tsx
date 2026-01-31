import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import Navbar from "../components/Navbar";
import {ThemeProvider} from "../ThemeContext";

describe("Navbar", () => {
  const mockSetPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "light"),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  test("renders all navigation links", () => {
    render(
      <ThemeProvider>
        <Navbar currentPage="pitch" setPage={mockSetPage} />
      </ThemeProvider>
    );

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Housing")).toBeInTheDocument();
    expect(screen.getByText("Occupations")).toBeInTheDocument();
    expect(screen.getByText("Family Types")).toBeInTheDocument();
    expect(screen.getByText("Immigration")).toBeInTheDocument();
  });

  test("calls setPage when navigation buttons are clicked", () => {
    render(
      <ThemeProvider>
        <Navbar currentPage="pitch" setPage={mockSetPage} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText("Housing"));
    expect(mockSetPage).toHaveBeenCalledWith("starts");

    fireEvent.click(screen.getByText("Occupations"));
    expect(mockSetPage).toHaveBeenCalledWith("occupations");
  });

  test("theme toggle button switches between light and dark mode", () => {
    render(
      <ThemeProvider>
        <Navbar currentPage="pitch" setPage={mockSetPage} />
      </ThemeProvider>
    );

    // Find the theme toggle button (has emoji)
    const toggleButton = screen.getByRole("button", {name: /🌙|☀️/});

    // Default theme is light
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    // Click to switch to dark mode
    fireEvent.click(toggleButton);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    // Click back to light mode
    fireEvent.click(toggleButton);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  test("displays brand logo", () => {
    render(
      <ThemeProvider>
        <Navbar currentPage="pitch" setPage={mockSetPage} />
      </ThemeProvider>
    );

    expect(screen.getByText("UHD")).toBeInTheDocument();
  });
});
