import express from 'express';
import axios from 'axios';
import validateInput from './shared/validations/signup';
import { validateCookie, validateSession} from './shared/validations/token';
import bcrypt from 'bcrypt';
import User from '../models/User';
import ErrorCodes from '../models/DbCodes';
import jwt from 'jsonwebtoken';
import config from '../config';
import cookie  from 'react-cookie';
import cookieParser from 'cookie-parser';
import log4js from 'log4js';

log4js.configure('./src/cfg/log4js-config.json');
const logger = log4js.getLogger('server');

function handleDBError(err) {
  const {code, index, errmsg, op} = err;
  return ErrorCodes[code];
}

let router = express.Router();
logger.info('[service]:[/api/user]::initialising');

/**
 * REST API: /api/user/ 
 * 
 * All google social interaction-requests come to this endpoint
 * 
 * 
 *  - POST http://api/user
 * 
 *  - GET http://api/user/google/{:google_profile_id}
 * 
 *  - POST http://api/user/google/{:google_profile_id}
 * 
 * 
 */



/*************************************************************
 *************************************************************
 * POST
 * 
 * @param  {} '/'
 * @param  {} req
 * @param  {} res
 *************************************************************/
router.post('/',(req,res) => {
  const {errors, isValid} = validateInput(req.body);
  logger.debug('[post]:[/api/user]:[request]::', req.body);

  if (isValid){
    const { email, username, password, timezone } = req.body;
    let newUser = new User({
      local: { 
        email: email, 
        username: username,
        password: bcrypt.hashSync(password, 10), 
        timezone: timezone,
        isVerified: false,
        language: 'en' }
    });

    newUser.save()
     .then(user => res.json({success: true}))
     .catch( err => res.status(400).json(
        { email: handleDBError(err) } )) //{ email: handleDBError(err)}
  }else {
    logger.error('[post]:[/api/user]:[error]::', errors);
    res.status(400).json(errors);
  }
});





/*************************************************************
 *************************************************************
 * GET
 * 
 * @param  /google/{:google_profile_id}
 * @param  {} req.params - contains google_profile_id
 * @param  {} res
 *             200 on successfully finding existing user
 *             404 otherwise
 *************************************************************/
router.get('/google/:google_profile_id', (req,res) => {
  logger.debug('[get]:[/api/user/google]:[google_profile_id]::',req.params.google_profile_id);
  User.findOne( {'google.id': req.params.google_profile_id } )
  .then( (usr) => {
    if (usr) {
      logger.error('[get]:[/api/user/google]:[user]::',usr);
      res.status(200).json( usr);
    } 
    else {
      logger.error('[get]:[/api/user/google]:[error]::user not found');
      res.status(404).json( {failure: 'user not found'} );
    }
  });
});




/*************************************************************
 *************************************************************
 * POST /google/{:google_profile_id}
 * 
 * @param:  {:google_profile_id}
 * @arg: { id, token, email, name }
 * @returns: 
 *  200 - updates 
 *  400 - error
 * 
 *************************************************************/
router.post('/google/:google_profile_id',(req,res) => {
  logger.debug('[post]:[/api/user/google]:[request]::',req.body);
  const { id, token, email, name } = req.body;

  logger.debug('[post]:[/api/user/google]:[google_profile_id]::',req.params.google_profile_id);
  
  let newUser = new User({
    google: { 
      id: id, 
      token: token,
      email: email,
      name: name}
    });

  logger.debug('[post]:[/api/user/google]:[user]::',newUser); 

  newUser.save()
  .then(user => res.json( newUser))
  .catch( err => res.status(500).json({ message: err } ))
});




/*************************************************************
 *************************************************************
 * POST /google/jwt/token
 * 
 * @param:
 * @arg:  { ck: 's$dfUdrr.....' }
 * @returns: 
 *  200 - jwtToken
 *  404 - error
 *************************************************************/
router.post('/google/cookie/jwt',(req,res) => {
  logger.debug('[post]:[/api/user/google/cookie/jwt]:[request]::',req); 
  const {errors, isValid} = validateCookie(req.body);

  if (isValid){
    const s_cookie = cookieParser.signedCookie(req.body.ck,config.cookieSecret); 
    logger.debug('[post]:[/api/user/google/cookie/jwt]:[signedCookie]::',s_cookie); 

    axios.get('http://localhost:6080/api/session/' + s_cookie)
      .then( s_res => {
        const { id, session, expires} = s_res.data;
        logger.debug('[post]:[/api/user/google/cookie/jwt]:[session]::',session);
        var jsonSession = JSON.parse(session);
        const {errors, isValid} = validateSession(jsonSession);
        const rec = { 
          user: {
                id: jsonSession['passport'].user._id,
                email: jsonSession['passport'].user['google'].email 
              }
        };

        axios.post('http://localhost:6080/api/auth/token', rec)
          .then(t_res => {
            logger.debug('[post]:[/api/user/google/cookie/jwt]:[token]::',t_res.data.token); 
            res.status(200).json(t_res.data.token);
          })
          .catch(function(error){
              logger.error('[post]:[/api/user/google/cookie/jwt]:[error]::',error.response.data); 
              res.status(500).json({error: error.response.data});
          });
          
      })
      .catch(function(error){
        logger.error('[post]:[/api/user/google/cookie/jwt]:[error]::',error.message); 
        res.status(500).json({ error:error.message});
      });
  }else{
    logger.error('[post]:[/api/user/google/cookie/jwt]:[error]::',errors); 
    res.status(500).json({ error: errors});
  }
});

export default router;