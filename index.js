//Setting up Express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

//Setting up EJS Layouts
const expressLayouts = require('express-ejs-layouts');

//Setting up Session Cookie and Passport
const session = require('express-session');
const passport = require('passport');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

//Setting up Database and Mongo Store for Session Cookies
const db = require('./config/mongoose');
const MongoStore = require('connect-mongo');

//Setting up flash messages and custom middleware for that
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');

app.use(express.urlencoded());
app.use(express.static('./assets'));
app.use(expressLayouts);

//Extract style and script from the sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//Setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in the db
app.use(
  session({
    name: 'ExpenseTracker',
    //TODO: change the secret key before deployment in production mode
    secret: process.env.ET_COOKIE_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: process.env.MONGO_URI,
        autoRemove: 'disabled',
      },
      function (err) {
        console.log(err || 'connect-mongodb setup ok');
      }
    ),
  })
);

//Use passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(customMiddleware.setFlash);

app.listen(PORT, function (err) {
  if (err) {
    console.log(`Error in running the Server: ${err}`);
    return;
  }
  console.log(`Server running in the port: ${PORT}`);
});
