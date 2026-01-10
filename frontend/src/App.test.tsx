import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App component", () => {
  it("renders greeting", () => {
    render(<App />);
    expect(screen.getByText(/Dev Academy Spring 2026/i)).toBeTruthy();
  });
});
