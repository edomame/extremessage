import { Router } from "express";
import { createChannel, getUserChannels, leaveChannel } from "../controllers/channelController.js";
import verifyToken from "../middleware/auth.js";

const router = Router();
