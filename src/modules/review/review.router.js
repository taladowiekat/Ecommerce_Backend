import { Router } from 'express';
import * as controller from './review.controller.js'
import { auth } from '../../middleware/auth.middleware.js';
import fileUpload, { fileType } from '../../utls/multer.js';

const router = Router({mergeParams:true});


router.post('/', auth(['User']) , fileUpload(fileType.image).single('image') , asyncHandler(controller.create))

export default router;
