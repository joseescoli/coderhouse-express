// Módulo Passport para autenticación con Github. Instalado con "npm i passport-github2"
import { Strategy as GithubStrategy } from 'passport-github2';
import passport from 'passport';
import UserDao from '../dao/mongodb/managers/user.dao.js';
const userDao = new UserDao();

const strategyOptions = {
    clientID: 'ENV',
    clientSecret: 'ENV',
    callbackURL: 'http://localhost:8080/github',
    scope: ["user:email"],
};

const registerOrLogin = async (accessToken, refreshToken, profile, done) => {
    // console.log('PROFILE --> ', profile);
    const { value: email } = profile.emails?.[0] ?? [{ value: null }];
    const user = await userDao.getByEmail( email );
    if ( user ) return done( null, user );
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
        profileImg: profile._json.avatar_url
    });
    return done(null, newUser);
}

passport.use('github', new GithubStrategy(strategyOptions, registerOrLogin));