import {Router} from 'express';
import { PrivilegeController } from '../controller/PrivilegesController';

const router = Router();
const privilegeController = new PrivilegeController();

router.get("/", privilegeController.getAll.bind(privilegeController));

router.post("/", privilegeController.create.bind(privilegeController));

router.get("/:id", privilegeController.getById.bind(privilegeController));

router.delete("/", privilegeController.delete.bind(privilegeController));


export default router;
