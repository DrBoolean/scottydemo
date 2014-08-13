var R = require('ramda')
var Validation = require('./validation');
var Success = Validation.Success;
var Failure = Validation.Failure;


module.exports = {
  isPresent:  curry(function(name, attrs){
    var valid = compose(lt(0), R.get('length'), replace(/\s+/, ''))(attrs[name]);
    return valid ? Success.of(attrs) : Failure.of([[name, "must be present"]])
  }),
  isEmail: curry(function(name, attrs) {
    var valid = test(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, attrs[name]);
    return valid ? Success.of(attrs) : Failure.of([[name, "must look like email"]])
  })
}
