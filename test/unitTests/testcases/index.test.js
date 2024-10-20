import { expect } from 'chai';

import {
  errorCodes,
  USER_ROLES
} from '../../../server/users/helpers/constants.js';
import UserService from '../../../server/users/services/index.js';
import BookFactory from '../utils/bookFactory.js';
import UserFactory from '../utils/userFactory.js';
import BookService from '../../../server/books/services/index.js';

const userFactory = new UserFactory();
const bookFactory = new BookFactory();

let adminData = {};
let readerData = {};
let createdAdmin = {};
let createdReader = {};

describe('User Test Cases', () => {
  before(async () => {
    adminData = userFactory.generateUser(USER_ROLES.ADMIN);
    readerData = userFactory.generateUser(USER_ROLES.READER);
  });

  describe('Valid User Test Cases', () => {
    describe('Signup as an Admin', () => {
      it('Should create a new user with the role admin', async () => {
        // adminData = factory.generateUser(USER_ROLES.ADMIN);
        createdAdmin = await UserService.createUser(
          adminData.name,
          adminData.email,
          adminData.password,
          adminData.role
        );

        expect(createdAdmin.role).to.equal(USER_ROLES.ADMIN);
        expect(createdAdmin.email).to.equal(adminData.email);
        expect(createdAdmin.name).to.equal(adminData.name);
        expect(createdAdmin.token).to.exist;
        expect(createdAdmin.password).to.not.exist;
      });
    });

    describe('Signup as a Reader', () => {
      it('Should create a new user with the role reader', async () => {
        readerData = userFactory.generateUser(USER_ROLES.READER);
        createdReader = await UserService.createUser(
          readerData.name,
          readerData.email,
          readerData.password,
          readerData.role
        );
        expect(createdReader.role).to.equal(USER_ROLES.READER);
        expect(createdReader.email).to.equal(readerData.email);
        expect(createdReader.name).to.equal(readerData.name);
        expect(createdReader.token).to.exist;
        expect(createdReader.password).to.not.exist;
      });
    });

    describe('login with valid credentials as an Admin', () => {
      it('Should return a user with a token', async () => {
        const loggedInAdmin = await UserService.login(
          adminData.email,
          adminData.password
        );

        expect(loggedInAdmin.email).to.equal(adminData.email);
        expect(loggedInAdmin.token).to.exist;
      });
    });

    describe('login with valid credentials as a Reader', () => {
      it('Should return a user with a token', async () => {
        const loggedInReader = await UserService.login(
          readerData.email,
          readerData.password
        );

        expect(loggedInReader.email).to.equal(readerData.email);
        expect(loggedInReader.token).to.exist;
      });
    });
  });

  describe('Invalid User Test Cases', async () => {
    describe('Signup with invalid role', () => {
      it('Should throw an error', async () => {
        const invalidUser = userFactory.generateUserWithInvalidRole();
        await UserService.createUser(
          invalidUser.name,
          invalidUser.email,
          invalidUser.password,
          invalidUser.role
        ).catch(error => {
          expect(error.errorCode).to.equals(errorCodes.INVALID_ROLE.code);
        });
      });
    });

    describe('Signup with invalid email', () => {
      it('Should throw an error', async () => {
        const invalidUser = userFactory.generateUserWithInvalidEmail();
        await UserService.createUser(
          invalidUser.name,
          invalidUser.email,
          invalidUser.password,
          invalidUser.role
        ).catch(error => {
          expect(error);
        });
      });
    });

    describe('login with invalid email', () => {
      it('Should throw an error', async () => {
        await UserService.login(userFactory.generateEmail(), '12345678').catch(
          error => {
            expect(error.errorCode).to.equal(
              errorCodes.INVALID_CREDENTIALS.code
            );
          }
        );
      });
    });

    describe('login with invalid password', () => {
      it('Should throw an error', async () => {
        await UserService.login(adminData.email, '1').catch(error => {
          expect(error.errorCode).to.equal(errorCodes.INVALID_CREDENTIALS.code);
        });
      });
    });
  });
});

describe('Book Test Cases', () => {
  let bookData = {};
  let bookReadingInterval = {};
  let book = {};
  before(async () => {
    bookData = bookFactory.generateBook();
    bookReadingInterval = bookFactory.generateBookReadingInterval();
  });

  describe('Create a new book as', () => {
    it('Should create a new book', async () => {
      book = await BookService.createBook(bookData.name, bookData.pages);
      expect(book).to.have.property('name', bookData.name);
      expect(book).to.have.property('pages', bookData.pages);
      expect(book).to.have.property('uniqueReadPages', 0);
      expect(book).to.have.property('intervals');
    });
  });

  describe('Add a new reading interval to a book', () => {
    it('Should add a new reading interval to a book and increment the uniqueReadPages', async () => {
      book = await BookService.addBookReadingInterval(
        bookData.name,
        bookReadingInterval.startPage,
        bookReadingInterval.endPage
      );
      expect(book).to.have.property(
        'uniqueReadPages',
        bookReadingInterval.endPage - bookReadingInterval.startPage + 1
      );
    });
  });

  describe('Add a new overlapping interval from the right to a book', () => {
    it('Should extend the existing interval and increment the uniqueReadPages', async () => {
      const incStartPage = bookReadingInterval.startPage + 1;
      const incEndPage = bookReadingInterval.endPage + 1;
      book = await BookService.addBookReadingInterval(
        bookData.name,
        incStartPage,
        incEndPage
      );

      expect(book).to.have.property(
        'uniqueReadPages',
        bookReadingInterval.endPage - bookReadingInterval.startPage + 2
      );
    });
  });

  describe('Add a new overlapping interval from the left to a book', () => {
    it('Should extend the existing interval and increment the uniqueReadPages', async () => {
      book = await BookService.addBookReadingInterval(
        bookData.name,
        bookReadingInterval.startPage - 1,
        bookReadingInterval.endPage - 1
      );
      expect(book).to.have.property(
        'uniqueReadPages',
        bookReadingInterval.endPage - bookReadingInterval.startPage + 3
      );
    });
  });

  describe('Add a new overlapping interval from both sides to a book', () => {
    it('Should extend the existing interval and increment the uniqueReadPages', async () => {
      book = await BookService.addBookReadingInterval(
        bookData.name,
        bookReadingInterval.startPage - 2,
        bookReadingInterval.endPage + 2
      );

      expect(book).to.have.property(
        'uniqueReadPages',
        bookReadingInterval.endPage - bookReadingInterval.startPage + 5
      );
    });
  });

  describe('Add a new small interval inside an existing interval to a book', () => {
    it('Should not change anything', async () => {
      const book = await BookService.addBookReadingInterval(
        bookData.name,
        bookReadingInterval.startPage + 2,
        bookReadingInterval.endPage - 2
      );
      expect(book).to.have.property(
        'uniqueReadPages',
        bookReadingInterval.endPage - bookReadingInterval.startPage + 5
      );
    });
  });
});
