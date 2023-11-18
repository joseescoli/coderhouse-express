import UserDao from "../dao/mongodb/managers/user.dao.js";
const userDao = new UserDao()
import { detectBrowser } from "../utils/utils.js";

export const register = (req, res) => {
    res.render('register')
};

export const login = (req, res) => {
    res.render('login')
};

export const errorRegister = (req, res) => {

    if ( req.session.path === '/register' ) {
        delete req.session.path
        res.render('errorRegister')
    }
    else
        res.redirect('/login')

};

export const errorLogin = (req, res) => {
    if ( req.session.path === '/login' ) {
        delete req.session.path
        res.render('errorLogin')
    }
    else
        res.redirect('/login')
};

export const profile = (req, res) => {
    if ( req.session.user )
        detectBrowser(req.get('User-Agent')) ? res.render('profile', {session: req.session.user.info}) : res.json(req.session.user.info)
    else
        res.redirect('/login')
};

export const logout = async (req, res) => {
    if ( req.session?.user ) {
        req.logger.debug(`User ${req.session.user.info.email} logged out!`);
        const user = await userDao.getById(req.session.passport.user)
        user.last_connection = Date.now()
        user.save()
        delete req.session.user
        req.session.destroy( (err) => {
            if( !err ) {
                detectBrowser(req.get('User-Agent')) ? res.redirect('/login') : res.json({ msg: 'Logout ok!' });
            }
            else
                res.json({ msg: err });
        })
        /*
        req.logout( error => {
            error ? req.logger.error(error.message) : detectBrowser(req.get('User-Agent')) ? res.redirect('/login') : res.json({ msg: 'Logout ok!' });
        })
        */
    }
    else
        detectBrowser(req.get('User-Agent')) ? res.redirect('/login') : res.json({ msg: 'User not logged in!' })
};