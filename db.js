var dbConfs = require('./config/db.json');
var Sql = require('sequelize');
var _ = require('lodash');

module.exports = function(env, opts) {
  var conf = _.assign({}, dbConfs[env], opts);
  return new Sql(conf.database, conf.username, conf.password, conf);
};
