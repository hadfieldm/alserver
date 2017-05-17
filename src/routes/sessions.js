import express from 'express';
import validateInput from './shared/validations/signup';
import bcrypt from 'bcrypt';
import FEsessions from '../models/Sessions';
import ErrorCodes from '../models/DbCodes';
import log4js from 'log4js';
import jwt from 'jsonwebtoken';
import config from 'config';

log4js.configure('./src/cfg/log4js-config.json');
const logger = log4js.getLogger('server');

function handleDBError(err) {
  const {code, index, errmsg, op} = err;
  return ErrorCodes[code];
}

let router = express.Router();
logger.info('[service]:[/api/session]::initialising');

const tokenP = config.get('Token');

/*************************************************************
 *************************************************************
 * GET
 * 
 * @param  /session/{:session_id}
 * @param  {} req.params.session_id - contains session_id
 * @param  {} res
 *             200 on successfully finding existing user
 *             400 otherwise
 *************************************************************/
router.get('/:session_id', (req,res) => {
  logger.debug('[get]:[/session]:[session_id]::',req.params.session_id);
  FEsessions.findById(req.params.session_id)
  .then(ses => {
    if (ses) {
      logger.debug('[get]:[/session]:[session]::',ses);
      res.status(200).json(ses);
    } 
    else {
      logger.error('[get]:[/session]:[error]::session not found');
      res.status(404).json( {failure: 'session not found'} );
    }
  })
  .catch(function(error){
    logger.error('[get]:[/session]:[session]::failed to query db collection');
  });
});

/*************************************************************
 *************************************************************
 * GET
 * 
 * @param  /session/{:id/session_id}
 * @param  {} req.params.session_id - contains session_id
 * @param  {} res
 *             200 on successfully finding existing user
 *             400 otherwise
 *************************************************************/
router.get('/id/:session_id', (req,res) => {
  logger.debug('[get]:[/session/id]:[session_id]::',req.params.session_id);
  FEsessions.findById(req.params.session_id)
  .then(ses => {
    if (ses) {
      logger.debug('[get]:[/session/id]:[session]::',ses);
      res.status(200).json(ses);
    } 
    else {
      logger.error('[get]:[/session/id]:[error]::session not found');
      res.status(404).json( {failure: 'session not found'} );
    }
  })
  .catch(function(error){
    logger.error('[get]:[/session/id]:[session]::failed to query db collection');
  });
});

/*************************************************************
 *************************************************************
 * DELETE
 * 
 * @param  /session/{:jwtToken}
 * @param  {} req.params.session_id - contains session_id
 * @param  {} res
 *             200 on successfully finding existing user
 *             400 otherwise
 *************************************************************/
router.delete('/:jwtToken', (req,res) => {
  logger.debug('[delete]:[/session]:[jwtToken]::',req.params.jwtToken);

  jwt.verify(req.params.jwtToken, tokenP.jwtSecret, (err, decoded) =>{
      if(err){
        logger.debug('[delete]:[/session]:[error]::Failed decoding');
        res.status(401).json({error: "Failed decoding"});
      }else{
        logger.debug('[delete]:[/session]:[decoded]::',decoded.id);
        //logger.debug('[delete]:[/session]:[email]::',decoded.email);
         FEsessions.findById(req.params.jwtToken)
          .then(ses => {
            if (ses) {
              logger.debug('[delete]:[/session]:[session]::',ses);
              res.status(200).json(ses);
            } 
            else {
              logger.error('[delete]:[/session]:[error]::session not found');
              res.status(404).json( {failure: 'session not found'} );
            }
          });
      }
  })
});

export default router;