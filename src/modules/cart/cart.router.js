import { Router } from 'express';
import * as controller from './cart.controller.js'

import { auth } from '../../middleware/auth.middleware.js';

const router = Router();


router.post('/', auth(['User']) , controller.create);
router.put('/clearCart', auth(['User']) , controller.clearCart);
router.put('/:productId', auth(['User']) , controller.remove);
router.get('/', auth(['User']) , controller.get);
router.put('/upadteQuantity/:productId', auth(['User']) , controller.upadteQuantity);
// router.put('/decreaseQuantity/:productId', auth(['User']) , controller.decreaseQuantity);

export default router;
