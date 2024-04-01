import { Router } from "express";
const router = Router();
import { addNewUser, getAllUsers } from "../controller/userController.js";

router.get(`/list`, getAllUsers);
router.post(`/add-user`, addNewUser);

export default router;
