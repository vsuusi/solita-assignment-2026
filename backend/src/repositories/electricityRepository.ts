import pool from "../db.js";
//import { ElectricityData } from "../types.js";

// data retrieval

export const electricityRepository = {
  async getDailySummaries(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: "ASC" | "DESC" = "ASC"
  ) {
    const sortMap: Record<string, string> = {
      date: "1",
      totalProductionMwh: "2",
      totalConsumptionKwh: "3",
      avgPrice: "4",
      hoursCount: "5",
    };

    const pageInt = Math.max(1, Number(page) || 1);
    const offset = (pageInt - 1) * limit;
    const orderBy = sortMap[sortBy] || "1";

    const query = `
      SELECT
        date,
        SUM("productionamount") AS "totalProductionMwh",
        SUM("consumptionamount") AS "totalConsumptionKwh",
        AVG("hourlyprice") AS "avgPrice",
        COUNT(id) AS "hoursCount"
      FROM "electricitydata"
      GROUP BY date
      ORDER BY ${orderBy} ${sortOrder}
      LIMIT $1 OFFSET $2;
    `;

    try {
      const result = await pool.query(query, [limit, offset]);
      return {
        result,
        meta: {
          page: pageInt,
          limit: limit,
        },
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  async getHourlyDataForDate(date: string) {
    const query =
      'SELECT * FROM "electricitydata" WHERE date = $1 ORDER BY "starttime" ASC;';
    const result = await pool.query(query, [date]);
    return result;
  },
};
