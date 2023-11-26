// Módulo Router Express
import { Router } from "express";
const router = Router();

// Métodos de las rutas de usuarios
import { loginUser, registerUser, githubLogin, passwordReset, passwordForm, password, passwordResetForm, changeRolePremium, uploadDocs, uploadDocsView, userList, usersToDelete, delUserById } from "../controllers/user.controllers.js"

// Módulo passport para inicio de sesión con estrategias local y Github
import passport from "passport";

// Middlewares involucrados en las vistas
import { isAuth } from '../middlewares/isAuth.js';  // Permite sólo usuarios autenticados
import access from '../middlewares/endpointRoles.js'; // Restringe cada endpoint con su rol o roles definidos
import { uploader } from "../middlewares/multer.js"; // Módulo para la subida de archivos al servidor Express (/src/data)

// POST - Registro passport local
router.post('/register', passport.authenticate('register'), registerUser);

// Login passport local
router.post('/login', passport.authenticate('login'), loginUser);

// GET - GitHub OAUTH
router.get('/oauth/github', passport.authenticate('github'));
// router.get('/oauth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GET - GitHub Login
router.get('/github', passport.authenticate('github'), githubLogin);

// GET - Formulario de solicitud de reseteo de contraseña. Pedido de correo.
router.get('/password/reset', passwordResetForm);

// POST - Solicitud de reseteo de contraseña. Envio de correo
router.post('/password/reset', passwordReset);

// GET - Cambio efectivo de contraseña por formulario
router.get('/password/change', passwordForm);

// PUT - Request con el cambio de contraseña. Esto es luego de superar el formulario o haber pasado por query param la variable token y el correcto token recibido por correo
router.post('/password/change', password);

// GET - Listado de usuarios (Sólo administradores).
router.get('/api/users', isAuth, access('admin'), userList);

// DELETE - Elimina usuarios que superen una cierta cantidad de días sin haberse conectado al sitio. La cantidad de días se define por variable de entorno. Por defecto 2 días. (Sólo administradores).
router.delete('/api/users', isAuth, access('admin'), usersToDelete);

// DELETE - Elimina usuario por ID. (Sólo administradores).
router.delete('/api/users/:uid', isAuth, access('admin'), delUserById);

// GET - Cambio de rol de usuario por ID. El rol se cambia de 'user' a 'premium'. (Sólo administradores).
router.get('/api/users/:uid/premium', isAuth, access('admin'), changeRolePremium);

// GET - Formulario de carga de archivos del tipo imágenes o documentos (Cualquier usuario autenticado).
router.get('/api/users/:uid/documents', isAuth, uploadDocsView);

// POST - Carga de archivos del tipo imágenes o documentos (Cualquier usuario autenticado).
router.post('/api/users/:uid/documents', isAuth, uploader.single('files'), uploadDocs);

export default router;