
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import User from './User';
import configAuth from '../config';
import bcrypt from 'bcrypt';

export default function(passport) {

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use(new GoogleStrategy({
	    clientID: configAuth.googleAuth.clientID,
	    clientSecret: configAuth.googleAuth.clientSecret,
	    callbackURL: configAuth.googleAuth.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){
	    		User.findOne({'email': profile.id}, function(err, user){
	    			if(err){
							console.log('err a');
	    				return done(err);
						}
	    			if(user){
							console.log('err b');
							console.log(user);
	    				return done(null, user);
	    			}else {
							console.log('err c');
	    				var newUser = new User();
	    				//newUser.google.id = profile.id;
	    				//newUser.google.token = accessToken;
	    				//newUser.google.name = profile.displayName;
	    				//newUser.google.email = profile.emails[0].value;
							newUser.email = profile.emails[0].value;
							newUser.password = bcrypt.hashSync(accessToken, 10)
	    				newUser.save(function(err){
	    					if(err)
	    						throw err;
	    					return done(null, newUser);
	    				})
	    				console.log(profile);
	    			}
	    		});
	    	});
	    }

	));

};
