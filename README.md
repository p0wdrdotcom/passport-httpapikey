# passport-httpapikey


HTTP apikey authentication strategy for [Passport](http://passportjs.org/).

This module lets you authenticate HTTP requests using apikeys in your Node.js
applications via the Authorization header. e.g. `Authorization: apikey abc123`


## Install

    $ npm install passport-httpapikey

## Usage

#### Configure Strategy

The HTTP Apikey authentication strategy authenticates users using an apikey.
The strategy requires a `verify` callback, which accepts that
key and calls `done` providing a user.  Optional `info` can be passed,
typically including associated scope, which will be set by Passport at
`req.authInfo` to be used by later middleware for authorization and access
control.
    

    let strategy = new LocalAPIKeyStrategy(function(apikey, done) {
        User.findOne({ apikey: apikey }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          return done(null, user, { scope: 'all' });
        });
    });

    passport.use(strategy);

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'apikey'` strategy, to
authenticate requests.  Requests containing apikey tokens do not require session
support, so the `session` option can be set to `false`.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/profile', 
      passport.authenticate('apikey', { session: false }),
      function(req, res) {
        res.json(req.user);
      });

## Tests

    $ npm install
    $ npm test

## Credits

  - [Geoff McIver](http://github.com/p0wdrdotcom)

## License

[The ISC license](https://opensource.org/licenses/ISC)

Copyright (c) 2017 Geoff McIver