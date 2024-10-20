import { StatusCodes } from 'http-status-codes';
import Book from '../model/index.js';
import ErrorResponse from '../../../common/utils/errorResponse.js';
import { errorCodes } from '../helpers/constants.js';

import logger from '../../../common/logger/index.js';
const { BAD_REQUEST } = StatusCodes;
class BookService {
  async createBook(name, pages) {
    const book = await Book.create({ name, pages });
    return book;
  }

  async addBookReadingInterval(name, startPage, endPage) {
    try {
      let book = await Book.findOne({ where: { name } });
      if (!book) {
        throw new ErrorResponse(
          errorCodes.BOOK_NOT_FOUND.message,
          BAD_REQUEST,
          errorCodes.BOOK_NOT_FOUND.code
        );
      }
      book = book.toJSON();
      if (startPage > endPage || endPage > book.pages) {
        throw new ErrorResponse(
          errorCodes.INVALID_INTERVAL.message,
          BAD_REQUEST,
          errorCodes.INVALID_INTERVAL.code
        );
      }
      const { uniqueReadPages, intervals } = this.handleBookIntervals(
        book.intervals,
        book.uniqueReadPages,
        startPage,
        endPage
      );
      const result = await Book.update(
        { intervals, uniqueReadPages },
        { where: { name }, returning: true }
      );
      return result[1][0].toJSON();
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getBooksRecommendations(top = 5) {
    const books = await Book.findAll({
      order: [['uniqueReadPages', 'DESC']],
      limit: top
    });
    return books;
  }

  handleBookIntervals(intervals = [], uniqueReadPages, start, end) {
    // First interval
    if (intervals.length === 0) {
      uniqueReadPages += end - start + 1;
      intervals.push([start, end]);
      return { uniqueReadPages, intervals };
    }

    for (let i in intervals) {
      let interval = intervals[i];

      const isNewSmallestInterval = start < interval[0] && end < interval[0];
      if (isNewSmallestInterval) {
        intervals.splice(i, 0, [start, end]);
        uniqueReadPages += end - start + 1;
        return { uniqueReadPages, intervals };
      }

      const isNewIntervalStart = start <= interval[0];
      const isNewIntervalEnd = end > interval[1];
      if (isNewIntervalStart) {
        // merge from the left side of the existing interval
        uniqueReadPages += interval[0] - start;
        interval[0] = start;

        if (isNewIntervalEnd) {
          // merge from the right side of the existing interval
          uniqueReadPages += end - interval[1];
          interval[1] = end;
        }
        return { uniqueReadPages, intervals };
      } else if (
        // if start lies inside an existing interval and end is outside the interval
        start > interval[0] &&
        start <= interval[1]
      ) {
        if (isNewIntervalEnd) {
          uniqueReadPages += end - interval[1];
          interval[1] = end;
          if (i + 1 < intervals.length) {
            const nextInterval = intervals[parseInt(i) + 1];
            if (end >= nextInterval[0]) end = nextInterval[0] - 1;
            uniqueReadPages += end - interval[1];
            interval[1] = end;
          }
          // the else would be all the user interval lies inside an already existing interval
        }
        return { uniqueReadPages, intervals };
      }
    }
    // new largest interval
    intervals.push([start, end]);
    uniqueReadPages += end - start + 1;
    return { uniqueReadPages, intervals };
  }
}

export default new BookService();
