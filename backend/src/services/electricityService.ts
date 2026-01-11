import { electricityRepository } from "../repositories/electricityRepository.js";
import {
  ElectricityData,
  SingleDayStats,
  SingleDayWarnings,
} from "../types.js";

// business logic

export const electricityService = {
  async getDaily(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: "ASC" | "DESC"
  ) {
    const sql_resp = await electricityRepository.getDailySummaries(
      page,
      limit,
      sortBy,
      sortOrder
    );
    return sql_resp;
  },

  // *****************************************************
  // Singe day stats: need work here
  // *****************************************************

  async getSingleDay(date: string): Promise<SingleDayStats> {
    const sql_resp = await electricityRepository.getHourlyDataForDate(date);

    const rows: Array<ElectricityData> = sql_resp.rows;
    const rowCount: number | null = sql_resp.rowCount;
    // warnings for displaying extra information in UI
    const warnings: SingleDayWarnings = {};

    if (!rowCount || rowCount === 0) {
      console.error(`No data found for date: ${date}`);
      throw new Error(`No data found for date: ${date}`);
    } else if (rowCount < 24) {
      warnings.rowCountWarning = `Expected 24 rows for date ${date}, but got ${rowCount}.`;
    }

    let totalElectricityConsumption: number = 0;
    let totalElectricityProduction: number = 0;
    let totalPrice: number = 0;
    let nullPriceRows: number = 0;

    rows.forEach((row) => {
      const consumption = row.consumptionamount;
      const production = row.productionamount;
      const price = row.hourlyprice;

      // handle nulls in price
      if (price === null) {
        nullPriceRows += 1;
      } else {
        totalPrice += price;
      }

      if (consumption === null) {
        warnings.totalConsumptionWarning = `Consumption amount is null for some entries on date ${date}.`;
      }
      if (production === null) {
        warnings.totalProductionWarning = `Production amount is null for some entries on date ${date}.`;
      }

      totalElectricityConsumption += consumption;
      totalElectricityProduction += production;
    });

    if (totalElectricityConsumption === 0) {
      warnings.totalConsumptionWarning = `No consumption data found for date ${date}.`;
    }
    if (totalElectricityProduction === 0) {
      warnings.totalProductionWarning = `No production data found for date ${date}.`;
    }

    const avgPrice =
      Math.round((totalPrice / (rowCount - nullPriceRows)) * 100) / 100;

    // 4. hour with most elec consump compared to prod

    // 5. cheapest elec hours for the day

    // can modify the return object however needed
    return {
      totalProductionMwh: Math.round(totalElectricityProduction * 100) / 100,
      totalConsumptionMwh:
        Math.round((totalElectricityConsumption / 1000) * 100) / 100, // normalize to Mwh
      averagePrice: avgPrice,
      hourWithMaxConsumption: "",
      cheapestHours: [],
      warnings: warnings,
    };
  },
};
