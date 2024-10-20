import { StatusCodes } from 'http-status-codes';
import UserService from '../services/index.js';
const { CREATED, OK } = StatusCodes;
import { USER_SIGNUP, USER_LOGIN } from '../helpers/constants.js';

class UserController {
  [USER_SIGNUP] = async (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;
      const user = await UserService.createUser(name, email, password, role);
      res.status(CREATED).json(user);
    } catch (error) {
      next(error);
    }
  };

  [USER_LOGIN] = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await UserService.login(email, password);
      res.status(OK).json(user);
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
