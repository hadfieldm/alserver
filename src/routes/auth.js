import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import { validateTokenInput, validateCredentialsInput } from './shared/validations/token';
import jsonschema from 'jsonschema';
import log4js from 'log4js';

log4js.configure('./src/cfg/log4js-config.json');
const logger = log4js.getLogger('server');

let router = express.Router();
logger.info('[service]:[/api/auth]::initialising');

/*************************************************************
 *************************************************************
 *  BaseURI: /api/auth
 *  POST endpoint
 *  
 * 
 * @param  {} '/'
 * @param  {} (req
 * @param  {} res
 * 
 *************************************************************/
router.post('/',(req,res) => {
  const {errors, isValid} = validateCredentialsInput (req.body);
  if (isValid){
    const {identifier, password } = req.body;
    User.findOne({'local.email': identifier })
      .then((usr) => {
        if (usr){
          if(bcrypt.compareSync(password,usr.local.password)){
            logger.debug('[post]:[/api/auth]:[id]::',usr._id);
            const token = jwt.sign({ id: usr._id, username: usr.email }, config.jwtSecret);
            res.json({token});
          }else{
            logger.error('[post]:[/api/auth]:[error]::invalid auth cred');
            res.status(401).json({errors: {form: 'Invalid Credentials'}});
          }
      }else{
        logger.warn('[post]:[/api/auth]:[error]::user not found');
        res.status(401).json({errors: {form: 'User not Found'}});
      }
    })
    .catch(err => res.status(500).json({error:'system exception: query user'}));
  }else{
    logger.error('[post]:[/api/auth]:[error]::',errors[0].message);
    res.status(500).json({message:errors[0].message});
  }
});

/**
 *  BaseURI: /api/auth/token
 *  rest-action: post
 *  returns jwtToken
 * 
 * @param  {} '/'
 * @param  {} (req
 * @param  {} res
 */
router.post('/token',(req,res) => {
  logger.debug('[post]:[/api/auth/token]:[request]::',req.body );
  const {errors, isValid} = validateTokenInput(req.body);

  if (isValid){
    const usr = req.body;
    const token = jwt.sign({ id: usr._id, username: usr.email }, config.jwtSecret);

    logger.debug('[post]:[/api/auth/token]:[token]::',token );
    res.status(200).json({token});
  }else{
    logger.error('[post]:[/api/auth/token]:[error]::', errors[0].message);
    res.status(500).json({message:errors[0].message});
  }
});


export default router;
