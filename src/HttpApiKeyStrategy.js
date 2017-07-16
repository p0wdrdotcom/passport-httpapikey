const passport = require('passport-strategy');
const util = require('util');

function HttpApikeyStrategy(verify) {
    if (!verify) throw new Error('HTTP apikey authentication strategy requires a verify function');

    passport.Strategy.call(this);
    this.name = 'apikey';
    this._verify = verify;
}

util.inherits(HttpApikeyStrategy, passport.Strategy);

HttpApikeyStrategy.prototype.authenticate = function(req) {
    var authorization = req.headers['authorization'];
    if (!authorization) {
        this.fail();
        return;
    }

    var parts = authorization.split(' ');
    if (parts.length < 2) {
        this.fail();
        return;
    }

    var scheme = parts[0];
    var apikey = parts[1];

    if (!/apikey/i.test(scheme)) {
        this.fail();
        return;
    }
    if (apikey.length < 2) {
        this.fail();
        return;
    }

    var self = this;

    function verified(err, user) {
        if (err) {
            self.error(err);
            return;
        }
        if (!user) {
            self.fail();
            return;
        }
        self.success(user);
    }
    this._verify(apikey, verified);
};

module.exports = HttpApikeyStrategy;