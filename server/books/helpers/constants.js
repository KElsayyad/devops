export const BOOK_CREATE = 'BOOK_CREATE';
export const ADD_BOOK_READING_INTERVAL = 'ADD_BOOK_READING_INTERVAL';
export const BOOKS_RECOMMENDATIONS = 'BOOKS_RECOMMENDATIONS';

export const errorCodes = Object.freeze({
  BOOK_ALREADY_EXISTS: {
    message: 'Book already exists',
    code: 20
  },
  BOOK_NOT_FOUND: {
    message: 'Book not found',
    code: 21
  },
  INVALID_INTERVAL: {
    message: 'Invalid interval',
    code: 22
  }
});
