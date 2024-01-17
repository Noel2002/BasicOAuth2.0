import {Router} from 'express';
import { AuthorizationController } from '../controller/AuthorizationController';

const router = Router();

const authorizationController = new AuthorizationController();

router.get('/authorize', authorizationController.authorize.bind(authorizationController));

router.post('/authenticate', authorizationController.authenticate.bind(authorizationController));


export default router;