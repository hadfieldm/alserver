import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import passport from 'passport';
import  passportFunction  from '../models/passports';

let router = express.Router();

passportFunction (passport);

passport.initialize();

function hello(req, res, next){
  console.log('testing in this middleware');
  next();
}

router.get('/',hello, passport.authenticate('google', {scope: ['profile', 'email']}),(req,res) => {});
//routepost('/callback',passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
//
export default router;
