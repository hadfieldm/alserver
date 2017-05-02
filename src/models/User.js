//import React from 'react';
import mongoose from 'mongoose';
import es6Promise from 'es6-promise';
import connections from './connections';

let userSchema = new mongoose.Schema ({
  local: {
    email       : {type: String, unique: true, trim: true, sparse: true, index: true},
    username    : {type: String, required: false, trim: true},
    displayname : {type: String, required: false},
    avatar      : {type: mongoose.Schema.Types.Mixed, required: false},
    password    : {type: String, required: false},
    timezone    : {type: String, required: false},
    isVerified  : {type: Boolean, rquired: false },
    language    : {type: String,required: false}
  },
  google: {
    id    :  {type: String, required: false},
    email :  {type: String, required: false, trim: true},
    name  :  {type: String, required: false}
  }
});

mongoose.Promise = es6Promise.Promise;
//export default mongoose.model('user', userSchema);
export default connections.userConn.model('user', userSchema);