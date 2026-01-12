import { Request, Response } from "express";
import { electricityService } from "../services/electricityService.js";

// traffic cop: doesnt know about sql or business logic
// handle errors here

function validateIsoDate(dateString: string): boolean {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  return date.toISOString().startsWith(dateString);
}

export const getDailyElectricityList = async (req: Request, resp: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const allowedSortFields = [
      "date",
      "starttime",
      "productionamount",
      "consumptionamount",
      "hourlyprice",
    ];
    const sortByParam = req.query.sortBy as string;
    const sortBy = allowedSortFields.includes(sortByParam)
      ? sortByParam
      : "date";

    const sortOrder =
      (req.query.sortOrder as string) === "DESC" ? "DESC" : "ASC";

    const result = await electricityService.getDaily(
      page,
      limit,
      sortBy,
      sortOrder
    );
    resp.json(result);
  } catch (e) {
    console.error("Error fetching daily stats:", e);
    resp.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSingleDayElectricityData = async (
  req: Request,
  resp: Response
) => {
  try {
    const date = req.params.date as string;

    if (!validateIsoDate(date)) {
      return resp
        .status(400)
        .json({ error: "Invalid date. Expected YYYY-MM-DD." });
    }

    const result = await electricityService.getSingleDay(date as string);
    resp.json(result);
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("No data found")) {
      return resp.status(404).json({ error: e.message });
    }
    console.error("error: ", e);
    return resp.status(500).json({ error: "Internal server error." });
  }
};
