import { Router } from 'express';
import * as controller from './category.controller.js'
import fileUpload, { fileType } from '../../utls/multer.js';
import { auth } from '../../middleware/auth.middleware.js';
import subCategoriesRouter from '../subCategory/subCategory.router.js';
import {validation} from '../../middleware/validation.js'
import * as schema from './category.validation.js'
import { asyncHandler } from '../../utls/catchError.js';

const router = Router();

//id==>category
router.use('/:id/subCategory',subCategoriesRouter);


router.post('/', fileUpload(fileType.image).single('image'),validation(schema.createCategorySchema),auth(['Admin']) , asyncHandler(controller.create));


router.get('/',asyncHandler(controller.getAll));


router.get('/active',asyncHandler(controller.getActive));

router.get('/:id',validation(schema.getDetailsSchema),auth(['User']),asyncHandler(controller.getDetails));


router.patch('/:id',fileUpload(fileType.image).single('image'),validation(schema.updateCategorySchema),auth(['User']),asyncHandler(controller.update));


router.delete('/:id',validation(schema.deleteCategorySchema),auth(['User']),asyncHandler(controller.destroy))
export default router;
