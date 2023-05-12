const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

passport.use(
  new googleStrategy(
    {
      clientID: process.env.ET_CLIENT_ID,
      clientSecret: process.env.ET_CLIENT_SECRET,
      callbackURL: process.env.ET_GOOGLE_CB,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        //Finding user if already present
        const user = await User.findOne({
          email: profile.emails[0].value,
        }).exec();

        console.log(profile);

        if (user) {
          //set the user as req.user
          return done(null, user);
        } else {
          //Creating new user if user is not found
          const createUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
          });

          return done(null, createUser);
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

module.exports = passport;
