import { Router } from 'express';
import * as controller from './cart.controller.js'
import { auth } from '../../middleware/auth.middleware.js';
import {validation} from '../../middleware/validation.js'
import * as schema from './cart.validation.js'
import { asyncHandler } from '../../utls/catchError.js';
const router = Router();

router.post('/', auth(['User']) ,validation(schema.createCartSchema),asyncHandler(controller.create));
router.put('/clearCart', auth(['User']) , asyncHandler(controller.clearCart));
router.put('/:productId', auth(['User']) , asyncHandler(controller.remove));
router.get('/', auth(['User']) , asyncHandler(controller.get));
router.put('/upadteQuantity/:productId', auth(['User']) , asyncHandler(controller.upadteQuantity));

export default router;
