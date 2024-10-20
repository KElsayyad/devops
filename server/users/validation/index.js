import Joi from 'joi';

import { USER_LOGIN, USER_ROLES, USER_SIGNUP } from '../helpers/constants.js';

export default {
  [USER_SIGNUP]: {
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      role: Joi.string()
        .required()
        .valid(...Object.values(USER_ROLES))
    }).required()
  },
  [USER_LOGIN]: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8)
    }).required()
  }
};
