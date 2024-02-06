import {Router} from 'express';
import { ClientController } from '../controller/ClientController';

const router = Router();
const clientController = new ClientController();

router.get("/", clientController.getAll.bind(clientController));

router.post("/", clientController.create.bind(clientController));

router.get("/:id", clientController.getById.bind(clientController));

router.delete("/", clientController.delete.bind(clientController));

router.patch("/:id/privileges/adding", clientController.addPrivileges.bind(clientController));


export default router;
