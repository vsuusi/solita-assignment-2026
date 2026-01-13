import { electricityRepository } from "../repositories/electricityRepository.js";
import {
  ElectricityData,
  SingleDayStats,
  DailyListItem,
  DataQuality,
} from "../types.js";

// warnings for missing data
function analyzeDataQuality(rows: ElectricityData[]): DataQuality {
  const issues: string[] = [];
  let missingRows = 24 - rows.length;

  if (missingRows > 0) {
    issues.push(`Missing ${missingRows} hourly data entries.`);
  }

  const nullPrices = rows.filter((row) => row.hourlyprice === null).length;
  const nullProds = rows.filter((row) => row.productionamount === null).length;
  const nullCons = rows.filter((row) => row.consumptionamount === null).length;

  if (nullPrices > 0) {
    issues.push(`Found ${nullPrices} entries with null price.`);
  }
  if (nullProds > 0) {
    issues.push(`Found ${nullProds} entries with null production.`);
  }
  if (nullCons > 0) {
    issues.push(`Found ${nullCons} entries with null consumption.`);
  }
  return {
    isValid: issues.length === 0,
    missingRows,
    issues,
  };
}

// calculates the longest consecutive hours with negative prices
function calcLongestNegativeHours(rows: ElectricityData[]): number {
  let max = 0;
  let current = 0;

  for (const row of rows) {
    if (row.hourlyprice !== null && row.hourlyprice < 0) {
      current += 1;
      if (current > max) {
        max = current;
      }
    } else {
      max = Math.max(max, current);
      current = 0;
    }
  }
  return Math.max(max, current);
}

export const electricityService = {
  async getDaily(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: "ASC" | "DESC"
  ): Promise<{ data: DailyListItem[]; meta: any }> {
    const resp = await electricityRepository.getDailySummaries(
      page,
      limit,
      sortBy,
      sortOrder
    );
    const rows = resp.rows;

    const dates = rows.map((row) => row.date);
    const hourlyData = await electricityRepository.getHourlyDataForDates(dates);

    const enrichedRows: DailyListItem[] = rows.map((daySum) => {
      const daysHours = hourlyData.filter((h) => h.date === daySum.date);
      const quality = analyzeDataQuality(daysHours);

      return {
        date: daySum.date,
        totalProductionMwh: Number(daySum.totalProductionMwh) || 0,
        totalConsumptionKwh: Number(daySum.totalConsumptionKwh) || 0,
        avgPrice: Number(Number(daySum.avgPrice).toFixed(2)) || 0,
        longestNegativeStreak: calcLongestNegativeHours(daysHours),
        quality: quality,
      };
    });

    return { data: enrichedRows, meta: resp.meta };
  },

  // *****************************************************
  // Singe day stats: need work here
  // *****************************************************

  async getSingleDay(date: string): Promise<SingleDayStats> {
    const rows = await electricityRepository.getHourlyDataForDate(date);

    if (rows.length === 0) {
      throw new Error(`No data found for date: ${date}`);
    }

    let totalElectricityProductionMwh: number = 0;
    let totalElectricityConsumptionKwh: number = 0;
    let totalPrice: number = 0;
    let validPriceCount: number = 0;
    let maxDiff: number = -999999999;
    let maxDiffTime: string = "";

    rows.forEach((row) => {
      totalElectricityProductionMwh += row.productionamount || 0;
      totalElectricityConsumptionKwh += row.consumptionamount || 0;
      if (row.hourlyprice !== null) {
        totalPrice += row.hourlyprice;
        validPriceCount++;
      }

      const prodKwh = (row.productionamount || 0) * 1000;
      const consKwh = row.consumptionamount || 0;
      const diff = consKwh - prodKwh;

      if (diff > maxDiff) {
        maxDiff = diff;
        maxDiffTime = row.starttime;
      }
    });

    const avgPrice =
      Math.round(Number(totalPrice / validPriceCount) * 100) / 100;

    const sortedByPrice = [...rows]
      // filter out nulls
      .filter((row) => row.hourlyprice !== null)
      // sort ascending
      .sort((a, b) => (a.hourlyprice as number) - (b.hourlyprice as number))
      // take cheapest 3
      .slice(0, 3)
      .map((row) => ({
        time: row.starttime,
        price: row.hourlyprice as number,
      }));

    // can modify the return object however needed
    return {
      date: date,
      summary: {
        totalProductionMwh: totalElectricityProductionMwh,
        totalConsumptionKwh: totalElectricityConsumptionKwh,
        avgPrice: avgPrice,
        maxDiffHour: {
          time: maxDiffTime,
          value: maxDiff,
        },
        cheapestHours: sortedByPrice,
      },
      quality: analyzeDataQuality(rows),
      hourlyData: rows,
    };
  },
};
