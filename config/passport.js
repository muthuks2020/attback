const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("../config/keys");
const { User } = require("../models/users");

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

const passportVerification = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log("------jwt_payload--------", jwt_payload);
      const { email } = jwt_payload;
      User.findOne({
        where: {
          email
        }
      })
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};

module.exports = passportVerification;
