import { Router } from 'express';
import * as controller from './category.controller.js'
import fileUpload, { fileType } from '../../utls/multer.js';
const router = Router();

router.post('/', fileUpload(fileType.image).single('image'),controller.create)

export default router;
