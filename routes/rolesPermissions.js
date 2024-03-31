import { Router } from "express";
const router = Router();
import {
  activateModule,
  addNewModule,
  deleteModule,
  getModulesAll,
  updateModule,
} from "../controller/moduleController.js";
import { validateModule } from "../middleware/rolesPermissions.js";

router
  .route(`/modules`)
  .get(getModulesAll)
  .post(validateModule, addNewModule)
  .delete(deleteModule);
router.patch(`/modules/:id`, validateModule, updateModule);
router.patch(`/activate-module/:id`, activateModule);

export default router;
