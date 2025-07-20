import {
        handleCreateVaultEntry, 
        handleUpdateVaultEntry, 
        handleSoftDeleteVaultEntry, 
        handleListVaultEntries } from "../controllers/vaultController.js";
import { sessionGuard } from "../middleware/sessionGuard.js";
import express from "express";

const router = express.Router();

router.post("/create", sessionGuard, handleCreateVaultEntry);
router.put("/update", sessionGuard, handleUpdateVaultEntry);
router.delete("/soft-delete", sessionGuard, handleSoftDeleteVaultEntry);
router.get("/list", sessionGuard, handleListVaultEntries);

export default router;
