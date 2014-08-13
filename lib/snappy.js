var _ = require('lodash');
var StateT = require('fantasy-states').StateT,
    ReaderT = require('fantasy-readers').ReaderT,
    Tuple2 = require('fantasy-tuples').Tuple2,
    Future = require('data.future');

var M = StateT(Future);
var App = ReaderT(M);

var liftReader = App.lift;

App.lift = function(x) {
  return liftReader(M.lift(x))
};

App.modify = function(f) {
  return liftReader(M.modify(f));
};
App.get = function() {
  return App.lift(M.get);
};
App.put = function(s) {
  return App.lift(M.put(s));
};

var log = function(x) {
  console.log(x); return x;
};
var json = function(x) {
  return liftReader(M(function(s) {
    s.contentType = "application/json";
    s.responseBody = x;
    return Future.of(Tuple2(x, s));
  }));
}
var html = function(x) {
  return liftReader(M(function(s) {
    s.contentType = "text/html";
    s.responseBody = x;
    return Future.of(Tuple2(x, s));
  }));
}
var text = function(x) {
  return liftReader(M(function(s) {
    s.contentType = "text/plain";
    s.responseBody = x;
    return Future.of(Tuple2(x, s));
  }));
}
var status = curry(function(code, x) {
  return liftReader(M(function(s) {
    s.status = code;
    return Future.of(Tuple2(x, s));
  }));
})

var param = function(i) {
  return function() {
    return App.ask.chain(function(req){
      return App.of(req.params[i]);
    })
  };
};

var body = App.ask.chain(function(req){
  return function() {
    return App.of(req.body);
  }
})


var Snappy = function(app) {
	var snpy = {}
	var methods = ['get', 'post', 'put', 'delete', 'patch'];

	var send = function(state) {
    state.res.send(state.status||200, state.responseBody);
  }

	methods.map(function(m) {
		snpy[m] = function(route, cb) {
			app[m](route, function(req, res) {
        cb(req).run(req).exec({res: res}).fork(send, send)
			});
		};
	})

  snpy.lift = App.lift;
  snpy.App = App;
  snpy.status = status;
  snpy.json = json;
  snpy.param = param;
  snpy.body = body;
  snpy.use = function(f) {
    app.use(f);
  };

	return snpy;
}

module.exports = Snappy;
