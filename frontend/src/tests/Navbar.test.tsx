import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import Navbar from "../components/Navbar";
import {ThemeProvider} from "../ThemeContext";

test("Theme toggle button switches between light and dark mode", () => {
  render(
    <ThemeProvider>
      <Navbar setPage={() => { }} />
    </ThemeProvider>
  );

  const toggleButton = screen.getByRole("button", {name: /dark mode/i});

  // Default theme is light
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");

  // Click to switch to dark mode
  fireEvent.click(toggleButton);
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

  // Click back to light mode
  fireEvent.click(toggleButton);
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
});
