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
            avatar: profile.photos[0].value,
          });

          return done(null, createUser);
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

// serializing to the user
passport.serializeUser(function (user, done) {
  done(null, user.id); //we are wanting to store the user id -- automatically encrypted
});

// deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);

    return done(null, user); //returning null because there is no error there
  } catch (err) {
    console.log('Error in finding user --> Passport');
    return done(err);
  }
});

//  CREATING THESE FUNCTION ON PASSPORT
//check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  //if the user is not authenticated
  return res.redirect('/signin');
};

//Setting the user for the views
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
