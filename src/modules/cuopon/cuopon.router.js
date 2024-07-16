import { Router } from 'express';
import * as controller from './cuopon.controller.js'
import { auth } from '../../middleware/auth.middleware.js';
import { validation } from '../../middleware/validation.js';
import * as schema from './cuopon.validation.js'
import { asyncHandler } from '../../utls/catchError.js';
const router = Router();

router.post('/',validation(schema.createCuoponSchema), auth(['Admin']) , asyncHandler(controller.create));

export default router;
