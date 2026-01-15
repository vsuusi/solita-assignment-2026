import pool from "../db.js";
import { ElectricityData } from "../types.js";

// data retrieval

export const electricityRepository = {
  async getDailySummaries(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: "ASC" | "DESC" = "ASC",
    startDate?: string,
    endDate?: string
  ) {
    const offset = (Math.max(1, page) - 1) * limit;
    const sortMap: Record<string, string> = {
      date: "date",
      totalProductionMwh: 'SUM("productionamount")',
      totalConsumptionKwh: 'SUM("consumptionamount")',
      avgPrice: 'AVG("hourlyprice")',
    };
    const orderBy = sortMap[sortBy] || "date";

    // filtering logic
    const whereConditions: string[] = [];
    const queryParams: (string | number)[] = [limit, offset];
    let paramIndex = 3; // $1 for limit, $2 for offset

    if (startDate) {
      whereConditions.push(`date >= $${paramIndex}`);
      queryParams.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      whereConditions.push(`date <= $${paramIndex}`);
      queryParams.push(endDate);
      paramIndex++;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const query = `
      SELECT
        date::text,
        SUM("productionamount") AS "totalProductionMwh",
        SUM("consumptionamount") AS "totalConsumptionKwh",
        AVG("hourlyprice") AS "avgPrice",
        COUNT(id) AS "hoursCount"
      FROM "electricitydata"
      ${whereClause}
      GROUP BY date
      ORDER BY ${orderBy} ${sortOrder} NULLS LAST
      LIMIT $1 OFFSET $2;
    `;

    const sql_resp = await pool.query(query, queryParams);

    // count query for pagination
    // count query for this project's db takes approx 0.0005 seconds, no need for separate optimization
    const countParams = queryParams.slice(2);
    let countWhereIndex = 1;
    const countConditions: string[] = [];

    if (startDate) {
      countConditions.push(`date >= $${countWhereIndex++}`);
    }
    if (endDate) {
      countConditions.push(`date <= $${countWhereIndex++}`);
    }

    const countWhereClause =
      countConditions.length > 0
        ? `WHERE ${countConditions.join(" AND ")}`
        : "";

    const countQuery = `SELECT COUNT(DISTINCT date)::int as total FROM "electricitydata" ${countWhereClause}`;
    const count_resp = await pool.query(countQuery, countParams);

    const totalRows = count_resp.rows[0].total || 0;
    const totalPages = Math.ceil(totalRows / limit);

    return {
      rows: sql_resp.rows,
      meta: {
        page,
        limit,
        totalPages: totalPages,
      },
    };
  },
  async getHourlyDataForDates(dates: string[]): Promise<ElectricityData[]> {
    if (dates.length === 0) return [];

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

  async getHourlyDataForDate(date: string): Promise<ElectricityData[]> {
    const query = `
      SELECT 
        id,
        date::text, 
        "starttime",
        "productionamount",
        "consumptionamount",
        "hourlyprice" 
      FROM "electricitydata" 
      WHERE date = $1 
      ORDER BY "starttime" ASC;`;
    const sql_resp = await pool.query(query, [date]);
    return sql_resp.rows;
  },
};
