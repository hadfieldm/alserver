import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import mongoose from 'mongoose';
import users from './routes/users';
import googleUserServices from './routes/user';
import localUserServices from './routes/auth';
import events from './routes/events';

import User from './models/User';
import configAuth from './config';

let app = express();

mongoose.connect('localhost:27017/users',()=> console.log('connecting to mongo'));

app.use(bodyParser.json());

//
// post all CRUD operations to this url.
app.use('/api/users', users);
app.use('/api/user/google', googleUserServices);
app.use('/api/auth', localUserServices);
app.use('/api/events', events);

app.listen(6080, () => console.log('Server started on port 6080'));
