import { Router } from "express";
import { isAuth } from '../middlewares/isAuth.js';
const router = Router();
import { login, register, errorLogin, errorRegister, profile, logout } from "../controllers/login.controllers.js";

router.get('/login', login);
router.get('/profile', profile);
router.get('/register', register);
router.get('/error-login', errorLogin);
router.get('/error-register', errorRegister);
router.get('/logout', logout);


export default router;