import { Router } from 'express';
import * as controller from './product.controller.js';
import fileUpload, { fileType } from '../../utls/multer.js';
import reviewRouter from '../review/review.router.js';
import * as schema from './product.validation.js';
import { auth } from '../../middleware/auth.middleware.js';
import { validation } from '../../middleware/validation.js';
import { asyncHandler } from '../../utls/catchError.js';

const router = Router();


router.use('/:productId/review', reviewRouter);


router.post('/' , auth(['Admin']),
    fileUpload(fileType.image).fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImage', maxCount: 5 }
    ]),
    asyncHandler(controller.create)
);


router.get('/',  asyncHandler(controller.getProduct));//*

export default router;

