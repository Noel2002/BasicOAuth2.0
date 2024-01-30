import {Router} from 'express';
import { UserController } from '../controller/UserController';

const router = Router();
const userController = new UserController();

router.get('/', userController.getAll.bind(userController));

router.get("/:id", userController.getById.bind(userController));

router.post("/", userController.create.bind(userController));

router.delete("/:id", userController.delete.bind(userController));

router.get("/userInfo", userController.getUserInfo.bind(userController));


export default router;