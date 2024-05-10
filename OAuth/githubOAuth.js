const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const User = require("../database/models/user");
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const [user, created] = await User.findOrCreate({
          where: { OAuthId: profile.id },
          defaults: {
            OAuthId: profile.id,
            username: profile.username,
          },
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
