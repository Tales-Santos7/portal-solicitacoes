import { Router } from "express";
import {
  createRequest,
  dashboard,
  deleteRequest,
  getRequest,
  listRequests,
  updateRequest,
  updateStatus,
} from "../controllers/request.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.use(authMiddleware);

router.get("/dashboard", dashboard);
router.get("/", listRequests);
router.post("/", createRequest);
router.get("/:id", getRequest);
router.patch("/:id", updateRequest);
router.delete("/:id", deleteRequest);
router.patch("/:id/status", updateStatus);

export default router;
