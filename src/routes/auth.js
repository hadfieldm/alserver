import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

let router = express.Router();

router.post('/',(req,res) => {
  const {identifier, password } = req.body;

  console.log('hello from auth-router.js');

  User.findOne({email: identifier })
    .then((usr) => {
      if (usr){
        if(bcrypt.compareSync(password,usr.password)){
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
