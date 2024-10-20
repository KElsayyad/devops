import { faker } from '@faker-js/faker';
import { USER_ROLES } from '../../../server/users/helpers/constants.js';

export default class UserFactory {
  generateUser(role) {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role
    };
  }

  generateUserWithInvalidEmail() {
    return {
      name: faker.person.fullName(),
      email: 'invalidEmail',
      role: USER_ROLES.ADMIN,
      password: faker.internet.password()
    };
  }

  generateUserWithInvalidPassword() {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: USER_ROLES.ADMIN,
      password: '23'
    };
  }

  generateUserWithInvalidRole() {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'invalidRole',
      password: faker.internet.password()
    };
  }

  generateEmail() {
    return faker.internet.email();
  }
}
