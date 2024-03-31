import { Router } from "express";
const router = Router();
import { addNewModule, getModulesAll } from "../controller/moduleController.js";
import { validateModule } from "../middleware/rolesPermissions.js";

router.route(`/modules`).get(getModulesAll).post(validateModule, addNewModule);

export default router;
