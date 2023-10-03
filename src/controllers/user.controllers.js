import UserDao from "../dao/mongodb/managers/user.dao.js"
const userDao = new UserDao();
import { detectBrowser } from "../utils/utils.js";

export const registerUser = async(req, res) => {
  /*
    try {
        res.json({
          msg: "Register ok",
          session: req.session,
        });
      } catch (error) {
          next(error.message);
      }
      */

    try {
        req.session.path = req.url

        // const newUser = await userDao.registerUser(req.body)
        // if ( newUser )
            res.redirect('/login');
        // else
            // res.redirect('/error-register')

    } catch (error) {
      req.logger.error(error.message)
    }

};

export const loginUser = async(req, res) => {
    try {
        req.session.path = req.url

        // Constante "user" que recibe toda la información de la base de datos
        const user = await userDao.getById(req.session.passport.user);

        if(user) {
            req.session.user = {
                loggedIn: true,
                sessionCount: 1,
                info: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    age: user.age,
                    role: user.role,
                    github: user.githubLogin,
                    image: user.profileImg,
                    cart: user.cart
                }
            }
            detectBrowser(req.get('User-Agent')) ? res.redirect('/') : res.send("Logged on!")
        } else
            res.redirect('/error-login')

    } catch (error) {
      req.logger.error(error.message)
    }
};

export const githubLogin = async (req, res, next) => {
    try {
      if ( req.user && req.session?.passport?.user ) {
        req.session.user = {
          loggedIn: true,
          sessionCount: 1,
          info: {
              first_name: req.user.first_name,
              last_name: req.user.last_name,
              email: req.user.email,
              age: req.user.age,
              role: req.user.role,
              github: req.user.githubLogin,
              image: req.user.profileImg,
              cart: req.user.cart
          }
        }
        res.redirect('/')
      }
      else
        res.redirect('/error-login')

      } catch (error) {
        req.logger.error(error.message)
        // next(error.message);
    }
  };