import { Router } from "express";
const router = Router();
import {
  addNewUser,
  editUser,
  getAllUserPermissions,
  getAllUsers,
} from "../controller/userController.js";
import { validateUser } from "../middleware/userMiddleware.js";

router.get(`/list-with-roles`, getAllUsers);
router.get(`/list-with-permissions`, getAllUserPermissions);
router.post(`/add-user`, validateUser, addNewUser);
router.patch(`/edit-user/:id`, validateUser, editUser);

export default router;
