import { Router } from "express";
import { loginUser, registerUser, githubLogin, passwordReset, passwordForm, password, passwordResetForm } from "../controllers/user.controllers.js"
import passport from "passport";

const router = Router();


// Registro passport local
router.post('/register', passport.authenticate('register'), registerUser);

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

// GitHub Register OAUTH
router.get('/oauth/github', passport.authenticate('github'));
// router.get('/oauth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub Login
router.get('/github', passport.authenticate('github'), githubLogin);

// Formulario de solicitud de reseteo de contraseña. Pedido de correo.
router.get('/password/reset', passwordResetForm);

// Solicitud de reseteo de contraseña. Envio de correo
router.post('/password/reset', passwordReset);

// Cambio efectivo de contraseña por formulario
router.get('/password/change', passwordForm);

// PUT request con el cambio de contraseña. Esto es luego de superar el formulario o haber pasado por query param la variable token con el correcto recibido por correo
router.post('/password/change', password);


export default router;