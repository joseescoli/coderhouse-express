// Módulo Passport para autenticación con Github. Instalado con "npm i passport-github2"
import { Strategy as GithubStrategy } from 'passport-github2';
import passport from 'passport';
import CartsDaoMongoDB from '../dao/mongodb/managers/carts.dao.js';
const cartDao = new CartsDaoMongoDB();
// Incorporación de variables de entorno para la configuración de claves sensibles
import config from '../config.js';

import UserDao from '../dao/mongodb/managers/user.dao.js';
const userDao = new UserDao();
import { sendMailEthereal } from '../services/email.services.js';

const strategyOptions = {
    clientID: config.GITHUB_CLIENTID,
    clientSecret: config.GITHUB_CLIENTSECRET,
    callbackURL: `http://localhost:${config.PORT}/github`,
    scope: ["user:email"]
};

const registerOrLogin = async (accessToken, refreshToken, profile, done) => {
    // console.log('PROFILE --> ', profile);
    const { value: email } = profile.emails?.[0] ?? [{ value: null }];
    const user = await userDao.getByEmail( email );
    // console.log("Chequeo usuario: " + user);
    if ( user ) return done( null, user );
    else {
        const cart = await cartDao.createCart()
        const fullName = profile._json.name;
        const parts = fullName.split(' '); 
        let lastName = '';
        parts.length > 1 ? lastName = parts.slice(1).join(' ') : lastName = parts[0];
        const newUser = await userDao.registerUser({
            first_name: profile._json.name.split(' ')[0],
            last_name: lastName,
            email,
            password: "",
            githubLogin: true,
            age: 0,
            profileImg: profile._json.avatar_url,
            cart: cart._id
        });
        // console.log("\n\nUsuario registrado: " + newUser);
        await sendMailEthereal(email)
        return done(null, newUser);
    }
}

passport.use('github', new GithubStrategy(strategyOptions, registerOrLogin));