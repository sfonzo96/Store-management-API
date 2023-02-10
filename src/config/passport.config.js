import { Strategy } from 'passport-local';
import userService from '../services/users.db.services.js';
import authService from '../services/auth.services.js';

function passportConfig(passport) {
  passport.use(
    'signup',
    new Strategy(
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
    new Strategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        try {
          const user = await authService.login(username, password);

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          console.log(error)
          done(null, false, { message: error.message })
          //throw new Error(error.message);
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
