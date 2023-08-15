import { Router } from "express";
import { loginUser, registerUser, githubLogin } from "../controllers/user.controllers.js"
import passport from "passport";

const router = Router();


// Registro passport local
//router.post('/register', passport.authenticate('register'), registerUser);

// Registro passport local con params
router.post('/register', passport.authenticate('register',
    {
    successRedirect: "/login",
    failureRedirect: "/error-register",
    passReqToCallback: true,
    })
);

// Login passport local
router.post('/login', passport.authenticate('login'), loginUser);

// Login passport local con params
/*
router.post('/login', passport.authenticate('login',
    {
    successRedirect: "/",
    failureRedirect: "/error-login",
    passReqToCallback: true,
    })
);
*/

// GitHub Register OAUTH
router.get('/oauth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub Login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), githubLogin);

// GitHub Login con params
/*
router.get('/github', passport.authenticate('github', {
    scope: ['user:email'],
    failureRedirect: '/errorLogin',
    successRedirect: '/profile',
    passReqToCallback: true
}));
*/

// Logout del sitio
router.get('/logout', (req, res) => {
    req.logout( (err) => {
        if(err) return res.send(err)
        else res.redirect('/login')
    })
})

export default router;