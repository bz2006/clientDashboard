import express from "express";
import { createIncident } from "../DBControllers/IncidentControllers.js";

const router = express.Router()


router.post("/create-incident", createIncident)

// //LOGIN

// router.get("/getall-incidents", getAllIncidents)

// router.get("/getincidents-by-id/:id", getIncidentById)

// router.put("/add-update/:id", addUpdateToIncident)

// router.put("/edit-incident/:id", updateIncident)


export default router