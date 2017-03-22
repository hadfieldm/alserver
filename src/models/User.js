//import React from 'react';
import mongoose from 'mongoose';
import es6Promise from 'es6-promise';

let userSchema = new mongoose.Schema ({
  email       : {type: String, unique: true, required: true},
  username    : {type: String, unique: true, required: true},
  displayname : {type: String, unique: true, required: false},
  avatar      : {type: mongoose.Schema.Types.Mixed, required: false},
  password    : {type: String, required: true},
  timezone    : {type:String, required: true},
  isVerified  : {type: Boolean, default: false, rquired: true },
  language    : {type: String, default : 'en', required: true}
});

mongoose.Promise = es6Promise.Promise;
export default mongoose.model('user', userSchema);
