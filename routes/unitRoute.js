import express from "express";
import { getHistoryByTravelId, getLiveData, getReportsByDateRange, getUserUnits } from "../DBControllers/unitsControllers.js";
const router = express.Router()


router.get("/get-units/:id", getUserUnits)

router.get("/get-live/:id", getLiveData)

router.get("/reports/by-date", getReportsByDateRange)

router.get("/report-path/:travelid", getHistoryByTravelId)


export default router