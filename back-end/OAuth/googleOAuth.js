const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../database/user");
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const [user, created] = await User.findOrCreate({
          where: { githubId: profile.id },
          defaults: {
            githubId: profile.id,
            username: profile.displayName, // Use profile.displayName for the Google username
            // You can add more user data from the Google profile if needed
          },
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
