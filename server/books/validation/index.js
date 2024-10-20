import Joi from 'joi';
import {
  BOOK_CREATE,
  ADD_BOOK_READING_INTERVAL,
  BOOKS_RECOMMENDATIONS
} from '../helpers/constants.js';

export default {
  [BOOK_CREATE]: {
    body: Joi.object({
      name: Joi.string().required(),
      pages: Joi.number().required()
    }).required()
  },
  [ADD_BOOK_READING_INTERVAL]: {
    body: Joi.object({
      name: Joi.string().required(),
      startPage: Joi.number().integer().min(1).required(),
      endPage: Joi.number().integer().min(1).required()
    }).required()
  },
  [BOOKS_RECOMMENDATIONS]: {
    query: Joi.object({
      top: Joi.number().default(5).max(100)
    }).required()
  }
};
