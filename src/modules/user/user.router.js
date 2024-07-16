import { Router } from 'express';
import * as controller from './user.controller.js'
import { asyncHandler } from '../../utls/catchError.js';
const router = Router();

router.get('/',asyncHandler(controller.getUsers));

router.get('/active',asyncHandler(controller.getUserData));

export default router;
