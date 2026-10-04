import { Router } from "express";
import { login, logout, me } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);

export default router;
