import express from 'express';
import validateInput from './shared/validations/signup';
import bcrypt from 'bcrypt';
import User from '../models/User';
import ErrorCodes from '../models/DbCodes';

let router = express.Router();

/**
 * REST API: /api/user/google 
 * 
 * All google social interaction-requests come to this endpoint
 * 
 *  - GET http://api/usr/google/{:google_profile_id}
 * 
 *  - PUT http://api/usr/google/{:google_profile_id}
 * 
 * 
 */



/**
 * GET
 * 
 * @param  {:google_profile_id}
 * @param  {} req.params - contains google_profile_id
 * @param  {} res
 *             200 on successfully finding existing user
 *             400 otherwise
 */
router.get('/:google_profile_id', (req,res) => {

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
 * PUT
 * 
 * @param  {:google_profile_id}
 * @param  {} req
 * @param  {} res
 */
router.put('/:google_profile_id',(req,res) => {

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
  .then(user => res.json( { id: newUser.id } ))
  .catch( err => res.status(400).json(
    { email: err } ))
});

export default router;