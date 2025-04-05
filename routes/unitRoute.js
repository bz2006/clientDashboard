import express from "express";
import { GenerateAppReport, GenerateReport, getHistoryByTravelId, getLiveData, getReportsByDateRange, getUserUnits } from "../DBControllers/unitsControllers.js";
import { deleteShortTrips } from "../DBControllers/AutoJobs.js";
const router = express.Router()


router.get("/get-units/:id", getUserUnits)

router.get("/get-live/:id", getLiveData)

router.get("/reports/by-date", getReportsByDateRange)

router.get("/generate-reports/:startDate/:endDate/:imei", GenerateReport)

router.get("/report-path/:travelid", getHistoryByTravelId)

router.post("/gen-reports", GenerateAppReport)


export default router