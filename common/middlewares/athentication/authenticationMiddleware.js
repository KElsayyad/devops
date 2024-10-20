import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { JWT_SECRET } from '../../../config/env/index.js';
import { errorCodes } from '../../../server/users/helpers/constants.js';
import logger from '../../logger/index.js';

const { FORBIDDEN, UNAUTHORIZED } = StatusCodes;

const Authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader)
      return res.status(UNAUTHORIZED).json({
        message: errorCodes.USER_NOT_AUTHORIZED.message,
        statusCode: UNAUTHORIZED,
        errorCode: errorCodes.USER_NOT_AUTHORIZED.code
      });

    if (
      !authHeader.startsWith('Bearer ') ||
      authHeader.trim().split(' ').length !== 2
    )
      return res.status(UNAUTHORIZED).json({
        message: errorCodes.INVALID_TOKEN.message,
        statusCode: UNAUTHORIZED,
        errorCode: errorCodes.INVALID_TOKEN.code
      });

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    const decodedUser = _.get(decoded, 'user', null);
    const userId = _.get(decodedUser, 'id', null);

    if (!userId)
      return res.status(FORBIDDEN).json({
        message: errorCodes.INVALID_TOKEN.message,
        statusCode: FORBIDDEN,
        error: errorCodes.INVALID_TOKEN.code
      });

    req.user = decodedUser;
    next();
  } catch (error) {
    logger.error(`Error in authenticateToken middleware: ${error.message}`);
    next(error);
  }
};

export default Authenticate;
