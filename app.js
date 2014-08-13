var express = require('express');
var http = require('http');
var Query = require('./lib/query');

require('lambdajs').expose(global);
require('pointfree-fantasy').expose(global);

global.maybe = curry(function(g, f, m) { return m.val ? f(m.val) : g(null); });
global.bireduce = curry(function(f, g, m) { return m.bireduce(f, g); });

global.log = function(x){
  console.log(x);
  return x;
}

var app = express();
var passport = require('passport');
var snappy = require('./lib/snappy')(app)


function mod(connection) {
  var schema = connection.import('./schema');
  var models = {};
  models.users = require('./app/models/users')(Query(schema.users));

  app.use(express.favicon());
  if(app.get('env') != 'test'){
    app.use(express.logger('dev'));
  }
  app.use(express.json());
  //app.use(express.urlencoded());
  app.use(passport.initialize());
  app.use(express.static(__dirname + '/public'));
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }

  var BasicStrategy = require('passport-http').BasicStrategy;
  passport.use(new BasicStrategy({ },function(email, password, done) {
    var finish = maybe(function(){ done(null, false); }, function(u) { done(null, u); });
    models.users.authenticate(email, password).fork(done, finish);
  }));

  app.use(passport.authenticate('basic', { session: false }));

  app.use(app.router);

  require('./app/controllers/users')(snappy, models);
  return app;
}

module.exports = mod;

if(require.main === module || app.get('env') === 'production') {
  var db = require('./db')(app.get('env'));
  var conf = require('./config/config')[app.get('env')];
  app = mod(db);
  http.createServer(app).listen(conf.port, function(){
    console.log('Express server listening on port ' + conf.port);
  });
}
