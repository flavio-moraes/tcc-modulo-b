const passport = require("passport");
const User = require("./models/User");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.API_URL + "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      let userData = {
        email: profile.emails[0].value,
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
      };

      User.fLoginOauth(userData)
        .then((user) => {
          done(null, user);
        })
        .catch((err) => {
          done(err);
        });
    }
  )
);

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.fLoginPassword(username, password)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err);
      });
  })
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.API_URL + "/auth/github/callback",
      scope: ["user:email"],
    },
    function (accessToken, refreshToken, profile, done) {
      let userData = {
        email: profile.emails[0].value,
        firstname: profile.displayName || profile.username,
        lastname: " ",
      };

      User.fLoginOauth(userData)
        .then((user) => {
          done(null, user);
        })
        .catch((err) => {
          done(err);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, { id: user.id, role: user.role });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
