import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import logger from '../../../common/logger/index.js';
import ErrorResponse from '../../../common/utils/errorResponse.js';
import { JWT_SECRET } from '../../../config/env/index.js';
import { errorCodes, USER_ROLES } from '../helpers/constants.js';
import User from '../model/index.js';

const { BAD_REQUEST, NOT_FOUND } = StatusCodes;

class UserService {
  async createUser(name, email, password, role) {
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new ErrorResponse(
          errorCodes.USER_ALREADY_EXISTS.message,
          BAD_REQUEST,
          errorCodes.USER_ALREADY_EXISTS.code
        );
      }

      if (!Object.values(USER_ROLES).includes(role)) {
        throw new ErrorResponse(
          errorCodes.INVALID_ROLE.message,
          BAD_REQUEST,
          errorCodes.INVALID_ROLE.code
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      let createdUser = await User.create({
        name,
        email,
        hashedPassword,
        role
      });

      createdUser = createdUser.toJSON();
      delete createdUser.hashedPassword;

      const token = await this.generateToken(createdUser);

      return { ...createdUser, token };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async generateToken(user) {
    try {
      const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '60d' });
      return token;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      let user = await User.findOne({ where: { email } });
      if (!user) {
        throw new ErrorResponse(
          errorCodes.INVALID_CREDENTIALS.message,
          NOT_FOUND,
          errorCodes.INVALID_CREDENTIALS.code
        );
      }
      user = user.toJSON();
      const isMatch = await bcrypt.compare(password, user.hashedPassword);
      if (!isMatch) {
        throw new ErrorResponse(
          errorCodes.INVALID_CREDENTIALS.message,
          BAD_REQUEST,
          errorCodes.INVALID_CREDENTIALS.code
        );
      }
      delete user.hashedPassword;
      const token = await this.generateToken(user);
      return { ...user, token };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async getUserById(id) {
    return await User.findByPk(id);
  }
}

export default new UserService();
