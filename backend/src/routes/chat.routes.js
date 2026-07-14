import { Router } from "express";
import { getAvailablePeers, getChatHistory, sendMessage } from "../controllers/chat.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/peers", verifyJWT, getAvailablePeers);
router.get("/history/:otherUserId", verifyJWT, getChatHistory);
router.post("/send", verifyJWT, sendMessage);

export default router;
