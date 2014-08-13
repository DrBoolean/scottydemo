module.exports = function(snappy, models) {
  var lift = snappy.lift
    , json = snappy.json
    , param = snappy.param
    , status = snappy.status
    , body = snappy.body
    , users = models.users
    ;

    snappy.get('/users', compose(chain(json), lift, users.all));

    snappy.get('/users/:id', compose( chain(maybe(status(404), json))
                                    , chain(compose(lift, users.get))
                                    , param('id')
                                    ))

    snappy.post('/users', compose( chain(json)
                                 , chain(bireduce(status(400), status(200)))
                                 , chain(compose(lift, users.create))
                                 , body))
};

