import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DetailedView from "../components/DetailedView";
import { electricityApi } from "../api/electricityApi";

vi.mock("../api/electricityApi");

describe("DetailedView tests", () => {
  test("fetches data for specific date and renders main content", async () => {
    const mockData = {
      hourlyData: [],
      summary: {
        avgPrice: 15.5,
        totalConsumptionKwh: 50000,
        totalProductionMwh: 100,
        cheapestHours: [],
        mostExpensiveHours: [],
      },
    };

    vi.mocked(electricityApi.getSingleDayElectricityData).mockResolvedValue(
      mockData,
    );

    render(
      <MemoryRouter initialEntries={["/day/2026-01-15"]}>
        <Routes>
          <Route path="/day/:date" element={<DetailedView />} />
        </Routes>
      </MemoryRouter>,
    );

    const date = await screen.findByText("Jan 15, 2026");
    expect(date).toBeInTheDocument();
    expect(screen.getByText("0.16")).toBeInTheDocument(); // price in eur rounded up
    expect(screen.getByText("50.0")).toBeInTheDocument(); // total cons MWh

    expect(electricityApi.getSingleDayElectricityData).toHaveBeenCalledOnce();
    expect(electricityApi.getSingleDayElectricityData).toHaveBeenCalledWith(
      "2026-01-15",
    );
  });
});
