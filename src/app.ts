import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { usersRouter } from './routers/users.router.js';
import { CustomError } from './errors/errors.js';
import path from 'path';
import { __dirname } from './config.js';
import createDebug from 'debug';

const debug = createDebug('W7CH5:app');

export const app = express();

const corsOptions = {
  origin: '*',
};

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

debug({ __dirname });
app.use(express.static(path.resolve(__dirname, 'public')));

app.use('/users', usersRouter);

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (error: CustomError, _req: Request, resp: Response, next: NextFunction) => {
    const status = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Internal server error';

    resp.status(status);
    resp.json({
      error: [
        {
          status,
          statusMessage,
        },
      ],
    });
    debug(status, statusMessage, error.message);
  }
);

app.use('*', (_req, resp, next) => {
  resp
    .status(404)
    .send(
      `<h1>Sorry, the path is not valid. Did you mean "http://localhost:4200/users/"?<h1>`
    );
  next();
});
