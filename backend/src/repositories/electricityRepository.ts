import pool from "../db.js";
import { ElectricityData } from "../types.js";

// data retrieval

export const electricityRepository = {
  async getDailySummaries(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: "ASC" | "DESC" = "ASC"
  ) {
    const offset = (Math.max(1, page) - 1) * limit;
    const sortMap: Record<string, string> = {
      date: "date",
      totalProductionMwh: 'SUM("productionamount")',
      totalConsumptionKwh: 'SUM("consumptionamount")',
      avgPrice: 'AVG("hourlyprice")',
    };
    const orderBy = sortMap[sortBy] || "date";

    const query = `
      SELECT
        date::text,
        SUM("productionamount") AS "totalProductionMwh",
        SUM("consumptionamount") AS "totalConsumptionKwh",
        AVG("hourlyprice") AS "avgPrice",
        COUNT(id) AS "hoursCount"
      FROM "electricitydata"
      GROUP BY date
      ORDER BY ${orderBy} ${sortOrder}
      LIMIT $1 OFFSET $2;
    `;

    const sql_resp = await pool.query(query, [limit, offset]);

    return {
      rows: sql_resp.rows,
      meta: {
        page,
        limit,
      },
    };
  },
  async getHourlyDataForDates(dates: string[]): Promise<ElectricityData[]> {
    if (dates.length === 0) return [];

    // Fetches all hours for the 10 days on the current page
    const query = `
      SELECT 
        id,
        date::text, 
        "starttime",
        "productionamount",
        "consumptionamount",
        "hourlyprice"
      FROM "electricitydata" 
      WHERE date::text = ANY($1) 
      ORDER BY date, "starttime" ASC;
    `;
    const sql_resp = await pool.query(query, [dates]);
    return sql_resp.rows;
  },

  // 3. Single Date Fetch
  async getHourlyDataForDate(date: string): Promise<ElectricityData[]> {
    const query = `SELECT * FROM "electricitydata" WHERE date = $1 ORDER BY "starttime" ASC;`;
    const sql_resp = await pool.query(query, [date]);
    return sql_resp.rows;
  },
};
