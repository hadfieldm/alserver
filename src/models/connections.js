import mongoose from 'mongoose';
import log4js from 'log4js';
import config from 'config';
log4js.configure('./src/cfg/log4js-config.json');
const logger = log4js.getLogger('server');
const mongo = config.get('Mongo');
const mongoUsersUrl = 'mongodb://' + mongo.host + ':' + mongo.port + '/users';
const mongoSessionsUrl = 'mongodb://' + mongo.host + ':' + mongo.port + '/fesessions';

exports.userConn = mongoose.createConnection(mongoUsersUrl);

exports.feSessionConn = mongoose.createConnection(mongoSessionsUrl);

exports.userConn.on('connected', function () { 
  logger.info('Mongoose userConn connection open');
 }); 

exports.feSessionConn.on('connected', function () {  
  logger.info('Mongoose feSession connection open');
 }); 

 exports.feSessionConn.on('error', function () {
   logger.info('Mongoose feSession error');
 }); 
