import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Here, you can redirect to the frontend with a token or session
    res.redirect('http://localhost:5173/dashboard'); // or send user info as query
  }
);

export default router;
