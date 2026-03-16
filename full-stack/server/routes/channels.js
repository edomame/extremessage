import { Router } from "express";
import { createChannel, getUserChannels, leaveChannel } from "../controllers/channelController.js";
import verifyToken from "../middleware/auth.js";

const router = Router();

router.use(verifyToken);

router.post("/", createChannel);
router.get("/", getUserChannels);
router.delete("/:id/leave", leaveChannel);

export default router;
