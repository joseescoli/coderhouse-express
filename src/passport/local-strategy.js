// Módulo Passport y Passport Local para serialización de usuarios. Instalado con "npm i passport passport-local"
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserDao from '../dao/mongodb/managers/user.dao.js';
const userDao = new UserDao();

const strategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
};

/* ----------------------------- lógica registro ---------------------------- */
const register = async(req, email, password, done) => {
    try {
        const user = await userDao.getByEmail(email);
        if (user) return done(null, false);
        // const { first_name, last_name,... } = req.body
        const newUser = await userDao.registerUser(req.body);
        return done(null, newUser);
    } catch (error) {
        console.log(error);
        //return done(error, false;)
    }
};


/* ------------------------------ lógica login ------------------------------ */
const login = async(req, email, password, done) => {
    try {
        const user = { email, password };
        // console.log('USER', user);
        const userLogin = await userDao.loginUser(user);
        // console.log('LOGIN', userLogin);
        if(!userLogin) return done(null, false, { message: 'User not found' });
        return done(null, userLogin);
    } catch (error) {
        console.log(error);
        //return done(error, false;)
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