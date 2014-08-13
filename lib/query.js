var Future = require('data.future');
var Maybe = require('pointfree-fantasy/instances/maybe');

module.exports = function(table) {

  var create = function(attrs) {
    return new Future(function(rej, res){
      return table.create(attrs).then(res);
    });
  };

  var all = function(opts){
    opts = opts || {};
    opts.order = [opts.order || ['id', 'asc']];
    return new Future(function(rej, res) {
      table.findAll(opts).then(res);
    });
  };

  var findBy = curry(function(key, value){
    var obj = {}
    obj[key] = value;
    return new Future(function(rej, res){
      return table.find({where: obj}).then(compose(res, Maybe));
    });
  });

  return {create: create, all: all, findBy: findBy};
};

