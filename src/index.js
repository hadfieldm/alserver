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
// import User from './models/User';
import configAuth from './config';
import cors from 'cors';
let app = express();

log4js.configure('./src/cfg/log4js-config.json');
const logger = log4js.getLogger('server');

mongoose.set('debug', true);

app.use(cors());
app.use(bodyParser.json());

app.use('/api/user', userServices);
app.use('/api/auth', localUserServices);
app.use('/api/events', events);
app.use('/api/session', sessionServices);
app.use('/api/v1/token', tokenServices);

app.listen(6080, () => logger.info('Server started on port 6080'));
