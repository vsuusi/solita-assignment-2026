import { describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import { electricityApi } from "../api/electricityApi";
import type { DailyListItem, DailyListResponse } from "../types";
vi.mock("../api/electricityApi");

const mockDataGenerator = (count: number): DailyListItem[] => {
  return Array.from({ length: count }).map((_, i) => ({
    date: `2026-01-${String(i + 1).padStart(2, "0")}`,
    avgPrice: 5 + i,
    totalProductionMwh: 100 + i,
    totalConsumptionKwh: 200000 + i,
    longestNegativeStreak: 0,
    quality: { issues: [], isValid: true, missingRows: 0 },
  }));
};

const mockResp = (
  data: DailyListItem[],
  totalPages = 1,
): DailyListResponse => ({
  data,
  meta: {
    page: 1,
    limit: 10,
    totalItems: data.length,
    totalPages,
  },
});

describe("MainTable tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("all main table components are visible", async () => {
    vi.mocked(electricityApi.getDailyElectricityList).mockResolvedValue(
      mockResp(mockDataGenerator(10)),
    );

    render(
      // wrap for react router
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );
    // await until table is rendered (only when api returns data)
    await screen.findByTestId("dashboard-page");

    expect(
      screen.getByText("Daily electricity statistics"),
    ).toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    expect(screen.getByText("Jan 1, 2026")).toBeInTheDocument();
    expect(screen.getByText("Jan 10, 2026")).toBeInTheDocument();
    expect(rows).toHaveLength(12); // datarows + column name row + pagination row

    const startDatePicker = screen.getByTestId("start-date-picker");
    const endDatePicker = screen.getByTestId("end-date-picker");
    expect(startDatePicker).toBeInTheDocument();
    expect(endDatePicker).toBeInTheDocument();

    // assert that each row has clickable btn
  });

  test("Each row has a details button", async () => {
    vi.mocked(electricityApi.getDailyElectricityList).mockResolvedValue(
      mockResp(mockDataGenerator(10)),
    );
    render(
      // wrap for react router
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );
    // await until table is rendered (only when api returns data)
    await screen.findByTestId("dashboard-page");

    const viewButtons = screen.getAllByRole("link", { name: /view details/i });
    expect(viewButtons).toHaveLength(10);
    viewButtons.forEach((btn) => {
      expect(btn).toHaveAttribute("href");
    });
  });

  test("rendert correct columns and defaut sort state", async () => {
    vi.mocked(electricityApi.getDailyElectricityList).mockResolvedValue(
      mockResp(mockDataGenerator(1)),
    );

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    await screen.findByTestId("dashboard-page");

    const headers = [
      "Date",
      "Avg Price",
      "Production",
      "Consumption",
      "Neg. Streak",
      "Action",
    ];

    headers.forEach((h) => {
      expect(
        screen.getByRole("columnheader", { name: new RegExp(h, "i") }),
      ).toBeInTheDocument();
    });

    const dateHeader = screen.getByRole("columnheader", { name: /date/i });
    expect(within(dateHeader).getByText(/▼/i)).toBeInTheDocument();
  });

  test("show empty state when no results for date from api", async () => {
    vi.mocked(electricityApi.getDailyElectricityList).mockResolvedValue(
      mockResp([], 0),
    );

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    await screen.findByText("No data found");

    expect(screen.getByText("No data found")).toBeInTheDocument();
  });

  test("renders pagination correctly", async () => {
    vi.mocked(electricityApi.getDailyElectricityList).mockResolvedValue(
      mockResp(mockDataGenerator(10), 5),
    );

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    await screen.findByTestId("dashboard-page");

    const limitSelect = screen.getByTestId("pagination-limit");
    expect(limitSelect).toBeInTheDocument();
    expect(limitSelect).toHaveValue("10");
  });
});
