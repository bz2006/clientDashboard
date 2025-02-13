import express from "express";
import { addGeoFence, AdmClientLogin, deleteGeofenceById, getGeoFences, updateGeoFence, updateUser, VerifyPassword } from "../DBControllers/userControllers.js";

const router = express.Router()


router.put("/add-geofence/:id", addGeoFence)

router.put("/update-geofence/:userid/:geofenceid", updateGeoFence)

router.get("/get-geofence/:id", getGeoFences)

router.delete("/delete-geofence/:userid/:geofenceid", deleteGeofenceById)

router.post("/verify-password", VerifyPassword)

router.post("/update-user/:id", updateUser)

router.post("/admcl-login", AdmClientLogin)


export default router