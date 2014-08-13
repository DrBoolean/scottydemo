function Validation() {};

function Success(val) {
  if(this instanceof Success){
    this.value = val;
  } else {
    return new Success(val);
  }
}
Success.prototype = new Validation();
Success.prototype.is_success = true;
Success.prototype.is_failure = false;
Success.prototype.reduce = function(f, x) {
  console.log("FAILURE REDUCE", f, x, this.value);
  return f(this.value, x);
}
Success.prototype.map = function(f) {
  return new Success(f(this.value));
}
Success.of = function(x) {
  return new Success(x);
}
Success.prototype.of = Success.of;
Success.prototype.ap = function(other) {
  return other.is_failure ? other : other.map(this.val);
}
Success.prototype.chain = function(f){
  return f(this.value);
}
Success.prototype.join = function(){ return this.value; }
Success.prototype.concat = function(other){ return other; };
Success.prototype.traverse = function(f, pure) {
  return f(this.value).map(Success);
};
Success.prototype.bimap = function(_, g) {
    return Success.of(g(this.value))
}

Success.prototype.bireduce = function(f, g) {
    return g(this.value);
}


//Failure's argument must be a semigroup (have a valid concat function)
function Failure(val) {
  if(this instanceof Failure){
    this.value = val;
  } else {
    return new Failure(val);
  }
}
Failure.prototype = new Validation();
Failure.prototype.is_success = false;
Failure.prototype.is_failure = true;
Failure.prototype.map = function(f){ return this; }
Failure.prototype.reduce = function(f, x) {
  return f(this.value, x);
}
Failure.prototype.bireduce = function(f, g) {
  return f(this.value);
}
Failure.of = function(x) {
  return new Failure(x);
}
Failure.prototype.of = Failure.of;
Failure.prototype.ap = function(other) {
  return other.is_failure ? this.concat(other) : this;
}
Failure.prototype.chain = function(f){ return this; }
Failure.prototype.join = function(f){ return this; }
Failure.prototype.concat = function(other){
  return other.is_success ? this :
    new Failure(this.value.concat(other.value));
};
Failure.prototype.traverse = function(f, pure) { return pure(this); };
Failure.prototype.bimap = function(f, _) {
    return Failure.of(f(this.value))
}
Validation.Success = Success;
Validation.Failure = Failure;

module.exports = Validation;
