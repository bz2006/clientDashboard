import express from "express";
import { addDevice, addGeoFence, AdmClientLogin, deleteGeofenceById, getGeoFences, updateGeoFence, updateSettings, updateUser, VerifyPassword } from "../DBControllers/userControllers.js";

const router = express.Router()


router.put("/add-geofence/:id", addGeoFence)

router.put("/update-geofence/:userid/:geofenceid", updateGeoFence)

router.get("/get-geofence/:id", getGeoFences)

router.delete("/delete-geofence/:userid/:geofenceid", deleteGeofenceById)

router.post("/verify-password", VerifyPassword)

router.post("/update-user/:id", updateUser)

router.post("/admcl-login", AdmClientLogin)

router.post("/add-device/:id", addDevice)

router.post("/change-settings/:id", updateSettings)


export default router