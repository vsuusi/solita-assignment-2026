import { Router } from "express";
import {
  getDailyElectricityList,
  getSingleDayElectricityData,
} from "../controllers/electricityController.js";

const router = Router();

router.get("/", getDailyElectricityList);
router.get("/:date", getSingleDayElectricityData);

export default router;
