import passportLocal from 'passport-local';
import passportGithub from 'passport-github2';
import container from '../container.js';
import UserDTO from '../dto/userDTO.js';
import logger from '../logger/index.logger.js';

const passportConfig = async (passport) => {
  const userService = container.resolve('UserService');
  const authService = container.resolve('AuthService');
  const config = container.resolve('ServerConfig');

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
          done(error);
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
          done(error);
        }
      }
    )
  );

  passport.use(
    'github',
    new passportGithub.Strategy(
      {
        clientID: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        callbackURL:
          'https://entregas-backend-coder.glitch.me/api/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userService.getUser(profile._json.email);

          if (!user) {
            const names = [
              profile.displayName.split(' ')[0],
              profile.displayName.split(' ')[1],
            ];
            const userData = {
              firstName: names[0],
              lastName: names[1],
              email: profile._json.email,
              age: 20,
              password: '',
              platform: 'github',
            };

            const newUser = await userService.createUser(userData);
            new UserDTO(newUser);
            return done(null, newUser);
          }

          done(null, new UserDTO(user));
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    logger.info('Serializing');
    if (!user.id) {
      user = new UserDTO(user);
    }
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    logger.info('Deserializing');
    const user = await userService.getUserById(id);
    if (!user) {
      return done(null, false);
    }

    done(null, user);
  });
};

export default passportConfig;
