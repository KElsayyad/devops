import express from 'express';
import { USER_SIGNUP, USER_LOGIN } from './helpers/constants.js';
import userController from './controllers/index.js';
import validateRequest from '../../common/middlewares/requestValidation/index.js';
import userValidation from './validation/index.js';

const router = express.Router();

router.post(
  '/',
  validateRequest(userValidation[USER_SIGNUP]),
  userController[USER_SIGNUP]
);
router.post(
  '/login',
  validateRequest(userValidation[USER_LOGIN]),
  userController[USER_LOGIN]
);

export default router;
