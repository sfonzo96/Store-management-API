import express from 'express';
import passport from 'passport';

const githubRouter = express.Router();

githubRouter.get('/failed', (req, res) => {
  console.log('error')
  res.render('error', {error: 'something went wrong'})
})

githubRouter.get('/login', passport.authenticate("githubSignup",{scope:["user:email"]}), passport.authenticate('githubLogin',{failureRedirect:'/api/github/failed'}))

githubRouter.get('/callback', passport.authenticate('githubSignup',{failureRedirect:'/api/github/failed'}), (req, res) => {
  res.redirect('/');
});

export default githubRouter;