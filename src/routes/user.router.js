import { Router } from "express";
import { loginUser, registerUser, githubLogin, passwordReset, passwordForm, password, passwordResetForm, changeRolePremium, uploadDocs, uploadDocsView } from "../controllers/user.controllers.js"
import passport from "passport";

const router = Router();

// Middlewares involucrados en las vistas
import { isAuth } from '../middlewares/isAuth.js';
import access from '../middlewares/endpointRoles.js';
import { uploader } from "../middlewares/multer.js";

// Registro passport local
router.post('/register', passport.authenticate('register'), registerUser);

// Registro passport local con params
/*
router.post('/register', passport.authenticate('register',
    {
    successRedirect: "/login",
    failureRedirect: "/error-register",
    passReqToCallback: true,
    })
);
*/

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

// Cambio de rol de usuario por ID. El rol se cambia de 'user' a 'premium' o viceversa. (Sólo administradores).
router.get('/api/users/:uid/premium', isAuth, access('admin'), changeRolePremium);

// GET - Formulario de carga de archivos del tipo imágenes o documentos (Cualquier usuario autenticado).
router.get('/api/users/:uid/documents', isAuth, uploadDocsView);

// POST - Carga de archivos del tipo imágenes o documentos (Cualquier usuario autenticado).
router.post('/api/users/:uid/documents', isAuth, uploader.single('files'), uploadDocs);

export default router;