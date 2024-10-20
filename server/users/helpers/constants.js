export const USER_SIGNUP = 'USER_SIGNUP';
export const USER_LOGIN = 'USER_LOGIN';

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  READER: 'READER'
};

export const errorCodes = Object.freeze({
  USER_ALREADY_EXISTS: {
    message: 'User already exists',
    code: 1
  },
  USER_NOT_AUTHORIZED: {
    message: 'User not authorized',
    code: 2
  },
  INVALID_TOKEN: {
    message: 'Invalid token',
    code: 3
  },
  INVALID_ROLE: {
    message: 'Invalid role',
    code: 4
  },
  USER_NOT_FOUND: {
    message: 'User not found',
    code: 5
  },
  INVALID_CREDENTIALS: {
    message: 'Invalid credentials',
    code: 6
  }
});
