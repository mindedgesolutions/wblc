import { Router } from "express";
const router = Router();
import {
  addNewUser,
  editUser,
  getAllUserPermissions,
  getAllUsers,
  getUserDetails,
  updateUserPermission,
} from "../controller/userController.js";
import { validateUser } from "../middleware/userMiddleware.js";
import { protectRoute } from "../middleware/authMiddleware.js";

router.get(`/list-with-roles`, getAllUsers);
router.get(`/list-with-permissions`, getAllUserPermissions);
router.post(`/add-user`, validateUser, addNewUser);
router.patch(`/edit-user/:id`, validateUser, editUser);
router.post(`/update-user-permission`, updateUserPermission);
router.get(`/user-info`, getUserDetails);

export default router;
