import { describe, expect, test } from "vitest";
import { formatKwhToMwhString, findPeakHour } from "../utils/utils";
import type { HourlyData } from "../types";

describe("util functions", () => {
  test("formatKwhToMwhString returns right unit and converts", () => {
    expect(formatKwhToMwhString(10555, 2)).toBe("10.56");
  });

  test("findPeakHour return correct hour", () => {
    const dummyHourlyData: HourlyData[] = [
      {
        id: 1,
        date: "2026-01-17",
        starttime: "2026-01-17T12:00:00",
        consumptionamount: 9000,
        productionamount: 5000,
        hourlyprice: 0.25,
      },
      {
        id: 2,
        date: "2026-01-17",
        starttime: "2026-01-17T13:00:00",
        consumptionamount: 9000,
        productionamount: 2000,
        hourlyprice: 0.3,
      },
    ];

    expect(findPeakHour(dummyHourlyData, "productionamount")).toEqual(
      dummyHourlyData[0],
    );
    expect(findPeakHour(dummyHourlyData, "hourlyprice")).toEqual(
      dummyHourlyData[1],
    );
  });
});
