import { Router } from "express";
const router = Router();
import { getAllUsers } from "../controller/userController.js";

router.get(`/list`, getAllUsers);

export default router;
