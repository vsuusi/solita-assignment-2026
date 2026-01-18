import { jest } from "@jest/globals";
import { electricityService } from "../src/services/electricityService.js";
import { electricityRepository } from "../src/repositories/electricityRepository.js";
import { ElectricityData } from "../src/types.js";

jest.mock("../src/repositories/electricityRepository.js");

describe("Electricity Service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getDailyList", () => {
    it("should merge summaries with hourly data and calculate negative streaks", async () => {
      const mockSummaries = {
        rows: [
          {
            date: "2023-01-01",
            totalProductionMwh: 10,
            totalConsumptionKwh: 200,
            avgPrice: 5,
            hoursCount: 24,
          },
        ],
        meta: { page: 1, limit: 10, totalPages: 1 },
      };

      const mockHourlyData = [
        { date: "2023-01-01", starttime: "01:00", hourlyprice: -1 }, // Streak 1
        { date: "2023-01-01", starttime: "02:00", hourlyprice: -5 }, // Streak 2
        { date: "2023-01-01", starttime: "03:00", hourlyprice: 10 }, // Break
        { date: "2023-01-01", starttime: "04:00", hourlyprice: -2 }, // Streak 1
      ] as ElectricityData[];

      jest
        .spyOn(electricityRepository, "getDailySummaries")
        .mockResolvedValue(mockSummaries);
      jest
        .spyOn(electricityRepository, "getHourlyDataForDates")
        .mockResolvedValue(mockHourlyData);

      const result = await electricityService.getDaily(1, 10, "date", "ASC");

      expect(result.data[0].date).toBe("2023-01-01");
      expect(result.data[0].totalProductionMwh).toBe(10);

      expect(result.data[0].longestNegativeStreak).toBe(2);

      expect(result.data[0].quality.isValid).toBe(false);
      expect(result.data[0].quality.missingRows).toBeGreaterThan(0);
    });

    it("should handle empty database results gracefully", async () => {
      jest.spyOn(electricityRepository, "getDailySummaries").mockResolvedValue({
        rows: [],
        meta: { page: 1, limit: 10, totalPages: 0 },
      });

      const result = await electricityService.getDaily(1, 10, "date", "ASC");

      expect(result.data).toEqual([]);
      expect(result.meta.limit).toBe(10);
    });
  });

  describe("getSingleDay", () => {
    it("should calculate correct totals, max diff, and cheapest hours", async () => {
      const mockRows = [
        {
          starttime: "01:00",
          productionamount: 0.01,
          consumptionamount: 100,
          hourlyprice: 10,
        },
        {
          starttime: "02:00",
          productionamount: 0.05,
          consumptionamount: 10,
          hourlyprice: -5,
        },
        {
          starttime: "03:00",
          productionamount: 0.01,
          consumptionamount: 50,
          hourlyprice: 2,
        },
      ] as ElectricityData[];

      jest
        .spyOn(electricityRepository, "getHourlyDataForDate")
        .mockResolvedValue(mockRows);

      const result = await electricityService.getSingleDay("2023-01-01");

      expect(result.summary.totalConsumptionKwh).toBe(160); // 100 + 10 + 50
      expect(result.summary.avgPrice).toBeCloseTo(2.33, 2); // (10 - 5 + 2) / 3

      expect(result.summary.maxDiffHour?.time).toBe("01:00");
      expect(result.summary.maxDiffHour?.valueKwh).toBe(90);

      expect(result.summary.cheapestHours[0].price).toBe(-5);
      expect(result.summary.cheapestHours[1].price).toBe(2);
    });

    it("should throw error if date has no data", async () => {
      jest
        .spyOn(electricityRepository, "getHourlyDataForDate")
        .mockResolvedValue([]);

      await expect(
        electricityService.getSingleDay("2023-01-01"),
      ).rejects.toThrow("No data found");
    });

    it("should flag quality issues if data is missing or null", async () => {
      const mockRows = [
        {
          starttime: "01:00",
          productionamount: null,
          consumptionamount: 100,
          hourlyprice: null,
        },
      ] as ElectricityData[];

      jest
        .spyOn(electricityRepository, "getHourlyDataForDate")
        .mockResolvedValue(mockRows);

      const result = await electricityService.getSingleDay("2023-01-01");

      expect(result.quality.isValid).toBe(false);
      expect(result.quality.issues).toContainEqual(
        expect.stringMatching(/entries with null price/),
      );
      expect(result.quality.issues).toContainEqual(
        expect.stringMatching(/entries with null production/),
      );
    });
  });
});
