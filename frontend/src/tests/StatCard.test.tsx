import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import StatCard from "../components/StatCard";

describe("StatCard tests", () => {
  test("renders provided props", () => {
    render(
      <StatCard title="Test card" value="100 MWh" comment="Test comment" />,
    );

    expect(screen.getByText("Test card")).toBeInTheDocument();
    expect(screen.getByText("Test comment")).toBeInTheDocument();
    expect(screen.getByText("100 MWh")).toBeInTheDocument();
  });

  test("renders children when provided", () => {
    render(
      <StatCard title="List card">
        <div data-testid="custom-item">Custom Row element</div>
        <div data-testid="custom-item-2">Custom Row element</div>
      </StatCard>,
    );

    expect(screen.getByTestId("custom-item")).toBeInTheDocument();
    expect(screen.getByTestId("custom-item-2")).toBeInTheDocument();
    expect(screen.getByText("List card")).toBeInTheDocument();
  });
});
