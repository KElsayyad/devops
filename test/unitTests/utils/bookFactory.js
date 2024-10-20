import { faker } from '@faker-js/faker';

export default class UserFactory {
  generateBook() {
    return {
      name: faker.person.fullName(),
      pages: 100
    };
  }

  generateBookWithInvalidPages() {
    return {
      name: faker.person.fullName(),
      pages: -6
    };
  }

  generateBookReadingInterval() {
    return {
      startPage: 10,
      endPage: 20
    };
  }
}
