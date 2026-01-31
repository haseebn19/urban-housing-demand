import React from "react";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {ThemeContext} from "../ThemeContext";
import ProductPitch from "../components/ProductPitch";

describe("ProductPitch Component", () => {
  test("renders the component and applies correct styles for light theme", () => {
    render(
      <ThemeContext.Provider value={{theme: "light", toggleTheme: jest.fn()}}>
        <ProductPitch />
      </ThemeContext.Provider>
    );

    const container = screen.getByTestId("product-pitch");

    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("pitch", "light");

    // Check headings
    expect(screen.getByRole("heading", {name: /Urban Housing Demand/i})).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: /Key Objectives/i})).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: /Our Approach/i})).toBeInTheDocument();
  });

  test("renders the component and applies correct styles for dark theme", () => {
    render(
      <ThemeContext.Provider value={{theme: "dark", toggleTheme: jest.fn()}}>
        <ProductPitch />
      </ThemeContext.Provider>
    );

    const container = screen.getByTestId("product-pitch");

    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("pitch", "dark");

    // Check headings
    expect(screen.getByRole("heading", {name: /Urban Housing Demand/i})).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: /Key Objectives/i})).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: /Our Approach/i})).toBeInTheDocument();
  });
});
