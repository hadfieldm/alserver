import express from 'express';
import validateInput from './shared/validations/signup';
import bcrypt from 'bcrypt';
import User from '../models/User';
import ErrorCodes from '../models/DbCodes';

function handleDBError(err) {
  const {code, index, errmsg, op} = err;
  return ErrorCodes[code];
}

let router = express.Router();

/**
 * REST API: /api/user/ 
 * 
 * All google social interaction-requests come to this endpoint
 * 
 * 
 *  - POST http://api/usr
 * 
 *  - GET http://api/usr/google/{:google_profile_id}
 * 
 *  - POST http://api/usr/google/{:google_profile_id}
 * 
 * 
 */


/**
 * POST
 * 
 * @param  {} '/'
 * @param  {} req
 * @param  {} res
 */
router.post('/',(req,res) => {
  const {errors, isValid} = validateInput(req.body);

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
    res.status(400).json(errors);
  }
});


/**
 * GET
 * 
 * @param  /google/{:google_profile_id}
 * @param  {} req.params - contains google_profile_id
 * @param  {} res
 *             200 on successfully finding existing user
 *             400 otherwise
 */
router.get('/google/:google_profile_id', (req,res) => {

  console.log('google_profile_id:', req.params.google_profile_id);

  User.findOne( {'google.id': req.params.google_profile_id } )
  .then( (usr) => {
    if (usr) {
      console.log('USER === ',usr);
      res.status(200).json( usr);
    } 
    else {
      res.status(404).json( {failure: 'user not found'} );
    }
  });
});





/**
 * POST
 * 
 * @param  /google/{:google_profile_id}
 * @param  {} req
 * @param  {} res
 */
router.post('/google/:google_profile_id',(req,res) => {

  console.log('put request:', req.params.google_profile_id);

  const { id, token, email, name } = req.body;

  let newUser = new User({
    google: { 
      id: id, 
      token: token,
      email: email,
      name: name}
    });

  console.log('newUser.id: ', newUser.google.id);

  newUser.save()
  .then(user => res.json( newUser))  //{ id: newUser.google.id } 
  .catch( err => res.status(400).json(
    { email: err } ))
});

export default router;