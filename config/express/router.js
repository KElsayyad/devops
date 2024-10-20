import express from 'express';

import books from '../../server/books/index.js';
import users from '../../server/users/index.js';

const router = express.Router();

router.use('/users', users);
router.use('/books', books);
router.use('/health', (req, res) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date()
  };

  res.status(200).send(data);
});

export default router;
