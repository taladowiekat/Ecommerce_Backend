import { Router } from 'express';
import * as controller from './order.controller.js'
import { auth } from '../../middleware/auth.middleware.js';
import { asyncHandler } from '../../utls/catchError.js';

const router = Router();


router.post('/', auth(['User']), asyncHandler(controller.create));


router.get('/userOrders', auth(['User']), asyncHandler(controller.getUserOrders));


router.patch('/:orderId/status', auth(['Admin']), asyncHandler(controller.changeStatus));


router.get('/pendingConfirmed', auth(['Admin']), asyncHandler(controller.getOrders));


export default router;

