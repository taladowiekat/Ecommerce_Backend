import { Router } from 'express';
import * as controller from './auth.controller.js'
import {validation} from '../../middleware/validation.js'
import * as schema from './auth.validation.js'
import { checkEmail } from '../../middleware/checkEmail.js';
import fileUpload, { fileType } from '../../utls/multer.js';
import { asyncHandler } from '../../utls/catchError.js';
const router = Router();

router.post('/register',validation(schema.registerSchema) , checkEmail, asyncHandler(controller.register));


router.post('/login',validation(schema.loginSchema) , asyncHandler(controller.login));


router.patch('/sendCode',validation(schema.sendCodeSchema) ,asyncHandler(controller.sendCode));


router.patch('/forgotPassword',asyncHandler(controller.forgotPassword));


router.get('/confirmEmail/:token',asyncHandler(controller.confirmEmail));

export default router;
