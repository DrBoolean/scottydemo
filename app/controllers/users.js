module.exports = function(snappy, models) {
  var lift = snappy.lift
    , json = snappy.json
    , param = snappy.param
    , status = snappy.status
    , body = snappy.body
    , App = snappy.App
    , users = models.users
    , _ = require('lodash')
    ;

    var setUser = function(attrs) {
      return App.ask.map(function(req) {
        return _.assign(attrs, {user: req.user})
      });
    };

    snappy.get('/users', function() {
      return lift(users.all({})).chain(json);
    });

    snappy.get('/users/:id', function() {
      return param('id').chain(compose(lift, users.get))
                        .chain(maybe(status(404), json));
    });

    snappy.post('/users', function() {
      return body.chain(setUser)
                 .chain(compose(lift, users.create))
                 .chain(bireduce(status(400), status(200)))
                 .chain(json);
    });
};

