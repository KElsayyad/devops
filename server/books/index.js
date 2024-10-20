import express from 'express';
import Authenticate from '../../common/middlewares/athentication/authenticationMiddleware.js';
import Authorization from '../../common/middlewares/authorization/authorizationMiddleware.js';
import validateRequest from '../../common/middlewares/requestValidation/index.js';
import BookController from './controllers/index.js';
import {
  ADD_BOOK_READING_INTERVAL,
  BOOK_CREATE,
  BOOKS_RECOMMENDATIONS
} from './helpers/constants.js';
import bookValidation from './validation/index.js';
import { permissions } from './helpers/permissions.js';

const router = express.Router();

router.post(
  '/',
  Authenticate,
  Authorization.Authorize(permissions[BOOK_CREATE], BOOK_CREATE),
  validateRequest(bookValidation[BOOK_CREATE]),
  BookController[BOOK_CREATE]
);

router.put(
  '/interval',
  Authenticate,
  Authorization.Authorize(
    permissions[ADD_BOOK_READING_INTERVAL],
    ADD_BOOK_READING_INTERVAL
  ),
  validateRequest(bookValidation[ADD_BOOK_READING_INTERVAL]),
  BookController[ADD_BOOK_READING_INTERVAL]
);

router.get(
  '/recommendations',
  Authenticate,
  Authorization.Authorize(
    permissions[BOOKS_RECOMMENDATIONS],
    BOOKS_RECOMMENDATIONS
  ),
  validateRequest(bookValidation[BOOKS_RECOMMENDATIONS]),
  BookController[BOOKS_RECOMMENDATIONS]
);

export default router;
