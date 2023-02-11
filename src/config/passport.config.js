import passportLocal from 'passport-local';
import userService from '../services/users.db.services.js';
import authService from '../services/auth.services.js';
import passportGithub from 'passport-github2';
import dotenv from 'dotenv';

dotenv.config();

function passportConfig(passport) {
  passport.use(
    'signup',
    new passportLocal.Strategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        try {
          const userExist = await userService.getUser(username);

          if (userExist) {
            return done(null, false, {
              message: 'Email is already registered',
            });
          }

          const user = await userService.createUser(req.body);

          return done(null, user);
        } catch (error) {
          throw new Error(error.message);
        }
      }
    )
  );

  passport.use(
    'login',
    new passportLocal.Strategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        try {
          const user = await authService.login(username, password);

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          done(null, false, { message: error.message });
          //throw new Error(error.message);
        }
      }
    )
  );

  passport.use(
    'githubSignup',
    new passportGithub.Strategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userService.getUser(profile._json.email);

          if (!user) {
            const names = [
              profile.displayName.split(' ')[0],
              profile.displayName.split(' ')[1],
            ]; // Asuming only one name
            const userData = {
              firstName: names[0],
              lastName: names[1],
              email: profile._json.email,
              age: 20,
              password: '',
              platform: 'github',
            };
            const newUser = await userService.createUser(userData);
            return done(null, newUser);
          }

          done(null, user);
        } catch (error) {
          throw new Error(error.message);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log('Serializing');
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    console.log('Deserializing');
    const user = await userService.getUserById(_id);
    if (!user) {
      return done(null, false);
    }

    done(null, user);
  });
}

export default passportConfig;
