import { Router } from 'express';
import * as controller from './subCategory.controller.js';
import fileUpload, { fileType } from '../../utls/multer.js';
import { auth } from '../../middleware/auth.middleware.js';
import { asyncHandler } from '../../utls/catchError.js';

const router = Router({ mergeParams: true });

router.post(
    '/',
    auth(['Admin']),
    fileUpload(fileType.image).single('image'),
    asyncHandler(controller.create)
);

router.get('/', auth(['User', 'Admin']), asyncHandler(controller.getAll));

router.get('/active', auth(['User', 'Admin']), asyncHandler(controller.getActive));

router.get('/:id', auth(['User', 'Admin']), asyncHandler(controller.getDetails));

router.patch(
    '/:id',
    auth(['Admin']),
    fileUpload(fileType.image).single('image'),
    asyncHandler(controller.update)
);

router.delete('/:id', auth(['Admin']), asyncHandler(controller.destroy));

export default router;

