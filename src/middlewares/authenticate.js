import jwt from 'jsonwebtoken';
import config from 'config';
import log4js from 'log4js';

var token = config.get('Token');
log4js.configure('./src/cfg/log4js-config.json');
const logger = log4js.getLogger('server');

export default (req, res, next) => {
  //first get the token
  const authorizationHeader  = req.headers['authorization'];
  let token;

  if (authorizationHeader){
    //extract the token "bearer {token}"
    //split by space and take second value in array
    token = authorizationHeader.split(' ')[1];
  }

  if (token){
    //if we have token verify it
    jwt.verify(token, token.jwtSecret, (err, decoded) =>{
      if(err){
        logger.debug('[middleware]:[authenticate]:[error]::Failed to Authenticate');
        res.status(401).json({error: "Failed to Authenticate"});
      }else{
        logger.debug('[middleware]:[authenticate]:[id]::',decoded.id);
        logger.debug('[middleware]:[authenticate]:[username]::',decoded.username);
        req.currentUser  = {
          id: decoded.id,
          username: decoded.username
        };
        next();
      }
    });
  } else{
    logger.error('[middleware]:[authenticate]:[error]::No token provided');  
    res.status(403).json({
      error: "No token provided"
    });
  }
}
