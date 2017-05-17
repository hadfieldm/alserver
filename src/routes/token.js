import express from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { validateTokenInput } from './shared/validations/token';

import log4js from 'log4js';
log4js.configure('./src/cfg/log4js-config.json');
const logger = log4js.getLogger('server');

let router = express.Router();

logger.info('[service]:[/api/v1/token]::initialising');

const tokenP = config.get('Token');

/*************************************************************
 *************************************************************
 * 
 *  BaseURI: /api/v1/token
 *  rest-action: post
 *    
 * 
 * @param  {} '/'
 * @param  {} req.params - contains user object
 * @param  {} res
 *             200 on successfully generating token
 *             404 otherwise
 *************************************************************/
router.post('/',(req,res) => {
    logger.debug('[post]:[/api/v1/token]:[request]: ',req.body)
    const {errors, isValid} = validateTokenInput(req.body);

    if (isValid){
        const usr = req.body;

        const token = jwt.sign(
        { id: usr._id,
            username: usr.email
        }, tokenP.jwtSecret);

        logger.debug('[post]:[/api/v1/token]:[token]:',token)
        res.status(200).json({token});
    }else{
        logger.error('[post]:[/api/v1/token]:[error]::',errors[0].message)
        res.status(404).json({ failure: errors});
    }

});

export default router;