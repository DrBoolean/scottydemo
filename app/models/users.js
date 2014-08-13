var _ = require('lodash');
var crypto = require('crypto');
var Future = require('data.future');
var V = require('../../lib/validators');
var Maybe = require('pointfree-fantasy/instances/maybe');

module.exports = function(db){

  //+ encrypt :: String -> String -> String
  var encrypt = function(pass, salt) {
    return crypto.createHash('sha1').update(pass + salt).digest('hex');
  }

  //+ removePassword :: User -> User
  var removePassword = function(user){
    return _.assign(user.values, {salt: undefined, encrypted_password: undefined})
  };

  //+ encryptPassword :: UserAttrs -> UserAttrs
  var encryptPassword = function(attrs) {
    var salt = Number(new Date);
    return _.assign(attrs, {encrypted_password: encrypt(attrs.password, salt), salt: salt })
  };

  //+ createFromForm :: UserAttrs -> Future(User)
  var createFromForm = compose(db.create, encryptPassword);

  //+ checkPassword :: String -> User -> Maybe(User)
  var checkPassword = curry(function(pass, user) {
    return Maybe(user.encrypted_password === encrypt(pass, user.salt) ? user : null);
  });

  //+ authenticate :: String -> String -> Future(Maybe(User))
  var authenticate = function(email, pass) {
    return compose(map(chain(checkPassword(pass))), db.findBy('email'), toLowerCase)(email);
  };

  //+ create :: UserAttrs -> Future(Validation(String, User))
  var create = compose(traverse(createFromForm, Future.of), mconcat([V.isPresent('password'), V.isEmail('email')]));

  //+ all :: Query -> Future(Maybe(User))
  var all = compose(map(map(removePassword)), db.all);

  //+ get :: Future(Maybe(User))
  var get = compose(map(map(removePassword)), db.findBy('id'));

  return {all:all, get: get, create: create, authenticate: authenticate}
};

