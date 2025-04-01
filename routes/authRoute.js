import express from "express";
import { ClientAppLogin, ClientLogin } from "../DBControllers/authControllers.js";
const router = express.Router()


router.post("/app-login", ClientAppLogin)


router.post("/cp-login", ClientLogin)


export default router