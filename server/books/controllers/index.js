import { StatusCodes } from 'http-status-codes';

import {
  ADD_BOOK_READING_INTERVAL,
  BOOK_CREATE,
  BOOKS_RECOMMENDATIONS
} from '../helpers/constants.js';
import BookService from '../services/index.js';

const { CREATED, OK } = StatusCodes;

class BookController {
  [BOOK_CREATE] = async (req, res, next) => {
    try {
      const { name, pages } = req.body;
      const book = await BookService.createBook(name, pages);
      res.status(CREATED).json(book);
    } catch (error) {
      next(error);
    }
  };

  [ADD_BOOK_READING_INTERVAL] = async (req, res, next) => {
    try {
      const { name, startPage, endPage } = req.body;
      const book = await BookService.addBookReadingInterval(
        name,
        startPage,
        endPage
      );
      res.status(OK).json(book);
    } catch (error) {
      next(error);
    }
  };

  [BOOKS_RECOMMENDATIONS] = async (req, res, next) => {
    try {
      const { top } = req.query;
      const books = await BookService.getBooksRecommendations(top);
      res.status(OK).json(books);
    } catch (error) {
      next(error);
    }
  };
}

export default new BookController();
