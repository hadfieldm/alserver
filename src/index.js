import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import mongoose from 'mongoose';
import userServices from './routes/user';
import localUserServices from './routes/auth';
import sessionServices from './routes/sessions';
import events from './routes/events';
import tokenServices from './routes/token';
import log4js from 'log4js';
import cors from 'cors';

let apiServer = express();

log4js.configure('./src/cfg/log4js-config.json');
const logger = log4js.getLogger('server');

mongoose.set('debug', true);

apiServer.use(cors());
apiServer.use(bodyParser.json());
apiServer.use('/api/user', userServices);
apiServer.use('/api/auth', localUserServices);
apiServer.use('/api/events', events);
apiServer.use('/api/session', sessionServices);
apiServer.use('/api/v1/token', tokenServices);

apiServer.listen(6080, () => logger.info('Server started on port 6080'));
