import {
  BOOK_CREATE,
  ADD_BOOK_READING_INTERVAL,
  BOOKS_RECOMMENDATIONS
} from './constants.js';
import { USER_ROLES } from '../../users/helpers/constants.js';

export const permissions = {
  [BOOK_CREATE]: [USER_ROLES.ADMIN],
  [ADD_BOOK_READING_INTERVAL]: [USER_ROLES.ADMIN, USER_ROLES.READER],
  [BOOKS_RECOMMENDATIONS]: [USER_ROLES.ADMIN, USER_ROLES.READER]
};
