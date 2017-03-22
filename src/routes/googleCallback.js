import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import passport from 'passport';
import  passportFunction  from '../models/passports';

let router = express.Router();

passportFunction (passport);

//passport.initialize();

router.post('/',passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));

export default router;
