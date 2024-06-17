import { Router } from 'express';
import * as controller from './product.controller.js'
import fileUpload, { fileType } from '../../utls/multer.js';
const router = Router();

router.get('/', fileUpload(fileType.image).fields([
    {name:'mainImage',maxCount:1},
    {name:'subImage',maxCount:5}
]) , 
    controller.create
);

export default router;
