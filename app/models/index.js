var fs        = require('fs')
  , path      = require('path')

module.exports = function(connection) {
  var models = {connection: connection}
  fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  }).forEach(function(file) {
    var model = connection.import(path.join(__dirname, file))
    models[model.name] = model
  })

  return models;
}
