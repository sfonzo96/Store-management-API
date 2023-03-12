export default function isAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    req.session.touch();
    return next();
}

/* export function auth(req, res, next) {
  if (req.session.logged) {
    req.session.touch();
    next();
  } else {
    res.status(400).send("User not registered");
  }
} */
