import { Router } from "express";
const router = Router();
import {
  activateModule,
  addNewModule,
  deleteModule,
  getAllModules,
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
  rolePermissions,
  updateRole,
} from "../controller/roleController.js";
import {
  activatePermission,
  addNewPermission,
  deletePermission,
  getAllPermissions,
  updatePermission,
} from "../controller/permissionController.js";

router
  .route(`/modules`)
  .get(getAllModules)
  .post(validateModule, addNewModule)
  .delete(deleteModule);
router.patch(`/modules/:id`, validateModule, updateModule);
router.patch(`/activate-module/:id`, activateModule);

router
  .route(`/roles`)
  .get(getAllRoles)
  .post(validateRole, addNewRole)
  .delete(deleteRole);
router.patch(`/roles/:id`, validateRole, updateRole);
router.patch(`/activate-role/:id`, activateRole);
router.post(`/map-role-permissions`, rolePermissions);

router
  .route(`/permissions`)
  .get(getAllPermissions)
  .post(validateModule, addNewPermission)
  .delete(deletePermission);
router.patch(`/permissions/:id`, validateModule, updatePermission);
router.patch(`/activate-permission/:id`, activatePermission);

export default router;
