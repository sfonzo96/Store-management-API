// Checks if user is authenticated (logged in)
const isAuthenticated = (req, res, next) => {
  // If it's not, is redirected to login page
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  // Updates the session expiration date
  req.session.touch();
  return next();
};

export default isAuthenticated;
