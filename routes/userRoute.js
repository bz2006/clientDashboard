import express from "express";
import { addDevice, addGeoFence, AdmClientLogin, checkSpecificFcmToken, deleteGeofenceById, getGeoFences, getSettings, updateAppUsage, updateGeoFence, updateSettings, updateUser, updateWebUsage, VerifyPassword } from "../DBControllers/userControllers.js";

const router = express.Router()


router.put("/add-geofence/:id", addGeoFence)

router.put("/update-geofence/:userid/:geofenceid", updateGeoFence)

router.get("/get-geofence/:id", getGeoFences)

router.delete("/delete-geofence/:userid/:geofenceid", deleteGeofenceById)

router.post("/verify-password", VerifyPassword)

router.post("/update-user/:id", updateUser)

router.post("/admcl-login", AdmClientLogin)

router.post("/add-device/:id", addDevice)

router.get("/check-fcm/:id", checkSpecificFcmToken)

router.post("/change-settings/:id", updateSettings)

router.get("/get-settings/:id", getSettings)

router.post("/update-appusage", updateAppUsage)

router.post("/update-webusage", updateWebUsage)


export default router