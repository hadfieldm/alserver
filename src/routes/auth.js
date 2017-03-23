import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

let router = express.Router();


/**
 *  BaseURI: /api/auth
 *  POST endpoint
 *  
 * 
 * @param  {} '/'
 * @param  {} (req
 * @param  {} res
 */
router.post('/',(req,res) => {
  const {identifier, password } = req.body;

  console.log('hello from auth-router.js');

  User.findOne({'local.email': identifier })
    .then((usr) => {
      if (usr){
        console.log('passwd ',usr.local.password);
        if(bcrypt.compareSync(password,usr.local.password)){
          console.log('id: ' + usr._id);

          const token = jwt.sign(
            { id: usr._id,
              username: usr.email
            }, config.jwtSecret);

          res.json({token});
        }else{
          console.log('invalid auth cred');
          res.status(401).json({errors: {form: 'Invalid Credentials'}});
        }
    }else{
      console.log('invalid cred');
      res.status(401).json({errors: {form: 'Invalid Credentials'}});
    }
  });
});

export default router;
