import { Router } from "express";
const router = Router();
import { addNewUser, getAllUsers } from "../controller/userController.js";
import { validateUser } from "../middleware/userMiddleware.js";

router.get(`/list`, getAllUsers);
router.post(`/add-user`, validateUser, addNewUser);

export default router;
