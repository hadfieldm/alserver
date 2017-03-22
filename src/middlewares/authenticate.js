import jwt from 'jsonwebtoken';
import config from '../config'; //we store the secret here. we use it below


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
    jwt.verify(token, config.jwtSecret, (err, decoded) =>{
      if(err){
        res.status(401).json({error: "Failed to authenticate"});
      }else{
        console.log("decoded :" + JSON.stringify(decoded));
        console.log("username :" + decoded.username);
        console.log("id :" + decoded.id);
        req.currentUser  = {
          id: decoded.id,
          username: decoded.username
        };
        next();
      }
    });
  } else{
    res.status(403).json({
      error: "No token provided"
    });
  }
}
