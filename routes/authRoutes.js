import { Router } from "express";
const router = Router();
import { validateAuth } from "../middleware/authMiddleware.js";
import { adminLogin, adminLogout } from "../controller/authController.js";

router.post(`/admin/login`, validateAuth, adminLogin);
router.get(`/admin/logout`, adminLogout);

export default router;
