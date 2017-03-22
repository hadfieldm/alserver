import express from 'express';
import validateInput from './shared/validations/signup';
import bcrypt from 'bcrypt';
import User from '../models/User';
import ErrorCodes from '../models/DbCodes';

let router = express.Router();

function handleDBError(err) {
  const {code, index, errmsg, op} = err;
  return ErrorCodes[code];
}

router.post('/',(req,res) => {

  const {errors, isValid} = validateInput(req.body);

  if (isValid){
    const { email, username, password, timezone } = req.body;
    let newUser = new User(
      { email: email, 
        username: username,
        password: bcrypt.hashSync(password, 10), 
        timezone: timezone,
        isVerified: false,
        language: 'en'
      });
    //console.log(newUser);
    newUser.save()
     .then(user => res.json({success: true}))
     .catch( err => res.status(400).json( { email: handleDBError(err) } )) //{ email: handleDBError(err)}
  }else {
    res.status(400).json(errors);
  }
});


export default router;
