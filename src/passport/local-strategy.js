// Módulo Passport y Passport Local para serialización de usuarios. Instalado con "npm i passport passport-local"
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserDao from '../dao/mongodb/managers/user.dao.js';
const userDao = new UserDao();
import CartsDaoMongoDB from '../dao/mongodb/managers/carts.dao.js';
const cartDao = new CartsDaoMongoDB();
import { sendMailEthereal } from '../services/email.services.js';
import { logger } from '../utils/logger.js';

const strategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
};

/* ----------------------------- lógica registro ---------------------------- */
const register = async(req, email, password, done) => {
    try {
        const cart = await cartDao.createCart()
        const user = await userDao.getByEmail(email);
        if (user) return done(null, false);
        // const { first_name, last_name,... } = req.body
        const obj = { ...req.body, cart: cart._id }
        const newUser = await userDao.registerUser( obj );
        await sendMailEthereal( { destination: email, service: 'reg' } )
        return done(null, newUser);
    } catch (error) {
        logger.error(error.message)
        return done(error, false)
    }
};


/* ------------------------------ lógica login ------------------------------ */
const login = async(req, email, password, done) => {
    try {
        const user = { email, password };
        // console.log('USER', user);
        const userLogin = await userDao.loginUser(user);
        // console.log('LOGIN', userLogin);
        if(!userLogin)
            return done(null, false, { message: 'User not found' });
        else
            return done(null, userLogin);
    } catch (error) {
        logger.error(error.message)
        return done(error, false)
    }
};

/* ------------------------------- strategies ------------------------------- */
const registerStrategy = new LocalStrategy(strategyOptions, register);
const loginStrategy = new LocalStrategy(strategyOptions, login);



/* ----------------------------- inicializacion ----------------------------- */
passport.use('login', loginStrategy);
passport.use('register', registerStrategy);



/* ------------------------- serialize y deserialize ------------------------ */
//guarda al usuario en req.session.passport
//req.session.passport.user --> id del usuario
passport.serializeUser( (user, done) => {
    // done(null, user._id)
    done(null, user._id)
});

passport.deserializeUser( async (id, done) => {
    const user = await userDao.getById(id);
    return done(null, user);
});