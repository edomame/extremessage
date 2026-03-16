import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import verifyToken from "../middleware/auth.js";

const router = Router();

router.use(verifyToken);

router.post("/:channelId", sendMessage);
router.get("/:channelId", getMessages);

export default router;
