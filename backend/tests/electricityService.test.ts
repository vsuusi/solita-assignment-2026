import { jest } from "@jest/globals";
import { electricityService } from "../src/services/electricityService.js";
import { electricityRepository } from "../src/repositories/electricityRepository.js";

jest.mock("../src/repositories/electricityRepository.js");

describe("Electricity Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getDailyList", () => {
    it("should return daily list data", async () => {
      const mockData = {
        result: {
          rows: [
            {
              date: "2023-01-01",
              totalProductionMwh: 100,
              totalConsumptionKwh: 200,
              avgPrice: 50,
              hoursCount: 24,
            },
          ],
          command: "SELECT",
          rowCount: 1,
          oid: 0,
          fields: [],
        },
        meta: {
          page: 1,
          limit: 10,
        },
      };

      const getDailySpy = jest
        .spyOn(electricityRepository, "getDailySummaries")
        .mockResolvedValue(mockData);

      const result = await electricityService.getDaily(1, 10, "date", "ASC");

      expect(getDailySpy).toHaveBeenCalledTimes(1);

      expect(result.result.rows[0].date).toBe("2023-01-01");
      expect(result.result.rows[0].totalProductionMwh).toBe(100);
      expect(result.result.rows[0].totalConsumptionKwh).toBe(200);
      expect(result.result.rows[0].avgPrice).toBe(50);
      expect(result.result.rows[0].hoursCount).toBe(24);
      expect(result.meta).toEqual({ page: 1, limit: 10 });
    });
  });
});
