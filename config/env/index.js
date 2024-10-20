import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const port = process.env.PORT || 3000;
export const pgDBConnection = {
  host: process.env.PG_DB_HOST,
  port: process.env.PG_DB_PORT,
  user: process.env.PG_DB_USER,
  password: process.env.PG_DB_PASSWORD,
  database: process.env.PG_DB_DATABASE,
  maxNumOfClients: parseInt(process.env.PG_DB_MAX_NUM_OF_CLIENTS),
  idleTimeoutMillis: parseInt(process.env.PG_DB_IDLE_TIMEOUT_MILLIS)
};

const API_BASE_URL = '/api';
const API_VERSION = 'v1';

export const API_BASE_PATH = `${API_BASE_URL}/${API_VERSION}`;

export const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
