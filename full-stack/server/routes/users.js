import { Router } from "express";
import { getAllUsers } from "../controllers/userController.js";
import verifyToken from "../middleware/auth.js";

const router = Router();

router.use(verifyToken);

router.get("/", getAllUsers);

export default router;
