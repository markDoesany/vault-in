import { handleUserActivityLogs } from "../controllers/activityController.js";
import { sessionGuard } from "../middleware/sessionGuard.js";
import express from "express";

const router = express.Router();

router.get("/history", sessionGuard, handleUserActivityLogs);

export default router;