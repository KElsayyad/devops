import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { ErrorHandler } from '../../common/middlewares/errorHandler/index.js';
import { API_BASE_PATH } from '../env/index.js';
import router from './router.js';
import customLogger from '../../common/middlewares/requestLogger/index.js';

const corsOptions = {
  origin: '*',
  maxAge: 3600
};
const helmetOptions = {
  crossOriginResourcePolicy: { policy: 'cross-origin' }
};

const app = express();

app.use(helmet(helmetOptions));
app.use(compression());
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(customLogger);
app.use(`${API_BASE_PATH}`, router);
app.use(ErrorHandler());

export default app;
