import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../utils/secrets';


const GoogleStrategy = passportGoogle.Strategy;

passport.use(new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect",
  },
  (accessToken, refreshToken, profile, done) => {
    const user = {
      profile,
      accessToken,
      refreshToken
    };
    return done(null, user);
  }
))

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});