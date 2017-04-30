import mongoose from 'mongoose';
import log4js from 'log4js';
log4js.configure('./src/cfg/log4js-config.json');
const logger = log4js.getLogger('server');

exports.userConn = mongoose.createConnection('mongodb://localhost:27017/users');

exports.feSessionConn = mongoose.createConnection('mongodb://localhost:27017/fesessions');

exports.userConn.on('connected', function () { 
  logger.info('Mongoose userConn connection open');
 }); 

exports.feSessionConn.on('connected', function () {  
  logger.info('Mongoose feSession connection open');
 }); 

 exports.feSessionConn.on('error', function () {
   logger.info('Mongoose feSession error');
 }); 
