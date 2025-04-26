import passport from "passport";
import express from "express";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile", "https://www.googleapis.com/auth/calendar"],
  })
);

router.get("/google/redirect", passport.authenticate("google", { failureRedirect: 'http://localhost:5173', session: true}), (req, res) => {
  res.redirect('http://localhost:5173/scheduler');
});

export default router;



