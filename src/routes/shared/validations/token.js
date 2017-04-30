import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import {Validator as SchemaValidator} from 'jsonschema';
import{ cookieSchema, cookieObjSchema, passportSchema, userTokenSchema, credentialsSchema } from '../../../models/Schemas';

export function validateCookie(data) {
  let errors = {};

  if(Validator.isEmpty(data.ck)){
    errors.identifier = 'Token cannot be empty';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

export function validateSession(data) {
  let v = new SchemaValidator();
  v.addSchema(cookieObjSchema, '/CookieObj');
  v.addSchema(passportSchema, '/Passport');

  const result = v.validate(data, cookieSchema);
 
  return {
    errors: result.errors,
    isValid: result.valid
  }
}

export function validateTokenInput(data) {
  let errors = {};
  let v = new SchemaValidator();
  const result = v.validate(data.user, userTokenSchema);
  return {
    errors: result.errors,
    isValid: result.valid
  }
}

export function validateCredentialsInput(data) {
  let errors = {};
  let v = new SchemaValidator();
  const result = v.validate(data, credentialsSchema);
  return {
    errors: result.errors,
    isValid: result.valid
  }
}

