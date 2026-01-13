import express from "express";
import {
    getAllUsers,
    getAllMeetings,
    getAllMeetingSummaries,
    getMeetingSummaryById,
    getDashboardStats,
    createUser,
    deleteUser,
    deleteMeeting
} from "../controllers/admin.controller.js";
import { isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/users", isAdmin, getAllUsers);
router.post("/users", isAdmin, createUser);
router.delete("/users/:id", isAdmin, deleteUser);

router.get("/meetings", isAdmin, getAllMeetings);
router.delete("/meetings/:id", isAdmin, deleteMeeting);

router.get("/summaries", isAdmin, getAllMeetingSummaries);
router.get("/summaries/:id", isAdmin, getMeetingSummaryById);
router.get("/stats", isAdmin, getDashboardStats);

export default router;
