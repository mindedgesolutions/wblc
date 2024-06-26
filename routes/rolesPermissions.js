import { Router } from "express";
const router = Router();
import {
  activateModule,
  addNewModule,
  deleteModule,
  getAllModules,
  getModulesWOPagination,
  updateModule,
} from "../controller/moduleController.js";
import {
  validateModule,
  validateRole,
} from "../middleware/rolesPermissions.js";
import {
  activateRole,
  addNewRole,
  deleteRole,
  getAllRoles,
  getRolesWOPagination,
  rolePermissions,
  updateRole,
} from "../controller/roleController.js";
import {
  activatePermission,
  addNewPermission,
  deletePermission,
  getAllPermissions,
  getPermissionsWOPagination,
  updatePermission,
} from "../controller/permissionController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

router
  .route(`/modules`)
  .get(protectRoute, getAllModules)
  .post(validateModule, addNewModule)
  .delete(deleteModule);
router.patch(`/modules/:id`, validateModule, updateModule);
router.patch(`/activate-module/:id`, activateModule);
router.get(`/all-modules`, getModulesWOPagination);

router
  .route(`/roles`)
  .get(protectRoute, getAllRoles)
  .post(validateRole, addNewRole)
  .delete(deleteRole);
router.patch(`/roles/:id`, validateRole, updateRole);
router.patch(`/activate-role/:id`, activateRole);
router.post(`/map-role-permissions`, rolePermissions);
router.get(`/all-roles`, getRolesWOPagination);

router
  .route(`/permissions`)
  .get(protectRoute, getAllPermissions)
  .post(validateModule, addNewPermission)
  .delete(deletePermission);
router.patch(`/permissions/:id`, validateModule, updatePermission);
router.patch(`/activate-permission/:id`, activatePermission);
router.get(`/all-permissions`, getPermissionsWOPagination);

export default router;
