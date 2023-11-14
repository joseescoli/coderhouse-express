import UserDao from "../dao/mongodb/managers/user.dao.js"
const userDao = new UserDao();
import { createTokenService, disableTokenService, getTokenByUserService } from "../services/token.service.js"
import { detectBrowser } from "../utils/utils.js";
import { HttpResponse } from "../utils/http.responses.js"
const httpResponse = new HttpResponse()
import { isValidPassword as isValidToken, createHash, resetToken } from "../utils/utils.js";
import { sendMailEthereal } from "../services/email.services.js";

export const registerUser = async(req, res) => {
  try {
        req.session.path = req.url
        detectBrowser(req.get('User-Agent')) ? res.redirect('/login') : httpResponse.Ok(res, { msg: "Register ok", session: req.session, })
    } catch (error) {
      return httpResponse.ServerError(res, error.message)
    }
};

export const loginUser = async(req, res) => {
    try {
        req.session.path = req.url

        // Constante "user" que recibe toda la información de la base de datos
        const user = await userDao.getById(req.session.passport.user);

        if(user && !user.githubLogin) {
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
            detectBrowser(req.get('User-Agent')) ? res.redirect('/') : httpResponse.Ok(res, "Logged on!")
        } else
            detectBrowser(req.get('User-Agent')) ? res.redirect('/error-login') : httpResponse.NotFound(res, "User or password incorrect!")

    } catch (error) {
      return httpResponse.ServerError(res, error.message)
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
        detectBrowser(req.get('User-Agent')) ? res.redirect('/') : httpResponse.Ok(res, "Logged on!")
      }
      else
        detectBrowser(req.get('User-Agent')) ? res.redirect('/error-login') : httpResponse.NotFound(res, "User token error or Github wrong credentials!")

      } catch (error) {
        return httpResponse.ServerError(res, error.message)
        // next(error.message);
    }
  };

// Formulario de confirmación de envío de correo para el reseteo de contraseña. Envio de correo para confirmar link con Token
export const passwordResetForm = async(req, res) => {
  try {
    detectBrowser(req.get('User-Agent')) ? res.render('passReset') : httpResponse.NotFound(res, 'Password reset form. Frontend email assignment and confirmation button. No available options from API calls!')
  } catch (error) {
    return httpResponse.ServerError(res, error.message)
  }
};

// Formulario de confirmación de envío de correo para el reseteo de contraseña. Envio de correo para confirmar link con Token
export const passwordReset = async(req, res) => {
  try {
    const email = isNaN(req.body.email) ? req.body.email : false
    const user = email ? await userDao.getByEmail(email) : false
    if ( user )
      if ( !(user.githubLogin) ) {
        // Se genera el token a hashear posteriormente en la base de datos
        const hash = await resetToken()
        // Se consume servicio de creación de token para generarse token hasheado con inicio de validez desde el momento que se crea (debajo) y límite de tiempo establecido en una hora en variables de entorno [RESET_TOKEN_EXPIRATION].
        await createTokenService( { user: user._id.toString(), token: createHash(hash) } ) // El modelo del token tiene por defecto establecido crear la fecha al momento de la creación del registro. No es necesario incorporar el campo createdAt.
        // Envío de correo con el token sin hashear. Esto permite al usuario hacer click en un link para derivarlo al endpoint /password/change con metodo GET de modo que el navegador pueda acceder
        await sendMailEthereal( { destination: email, service: 'resetPass', name: user.first_name, token: hash } )
        detectBrowser(req.get('User-Agent')) ? res.render('passReset', { name: user.first_name } ) : httpResponse.Ok(res, 'Password reset email sent!')
      } else
        return httpResponse.WrongInfo(res, 'User has Github passport. You have to reset your password at "https://github.com/setting/security" if you want to change your password. Otherwise, if you forgot your Github password you need to change it at "https://github.com/password_reset".')
      else
        return httpResponse.NotFound(res, 'User does not exists!')
  } catch (error) {
    return httpResponse.ServerError(res, error.message)
  }
};

// Formulario de cambio de contraseña
export const passwordForm = async(req, res) => {
  try {
        const token = req.query?.token ? String(req.query.token) : false
        const email = req.query?.email ? String(req.query.email) : false
        if ( isNaN(token) && token ) {
          const user = await userDao.getByEmail(email)
          const tokenDB = await getTokenByUserService(user._id)
          const isTokenCorrect = tokenDB ? isValidToken(token, tokenDB.token) : false
          if( !(user.githubLogin) ) {
            if ( isTokenCorrect && tokenDB.status ) {
              detectBrowser(req.get('User-Agent')) ? res.render('passChange', {email}) : httpResponse.Ok(res, `Send PUT request to /password/change?token=${token}.\nAlso send in request body the parameter "password" with the new password selected!`)
            }
            else
              detectBrowser(req.get('User-Agent')) ? res.redirect('/password/reset') : httpResponse.NotFound(res, 'Token incorrect or expired!')
          } else return httpResponse.WrongInfo(res, 'User has Github passport. You have to reset your password at "https://github.com/setting/security" if you want to change your password. Otherwise, if you forgot your Github password you need to change it at "https://github.com/password_reset".')
        } else return httpResponse.Unauthorized(res, 'Access not allowed without a correct token!')
    } catch (error) {
      return httpResponse.ServerError(res, error.message)
    }
};

// Método PUT para cambio de contraseña mediante token por query y password por body
export const password = async(req, res) => {
  try {
    const password = req.body?.password
    const email = req.query?.email ? String(req.query.email) : false
    if ( isNaN(password) && password ) {
      const user = await userDao.getByEmail(email)
      if ( user ) {
        if( !(user.githubLogin) ) {
          const tokenDB = await getTokenByUserService(user._id)
          if ( tokenDB && tokenDB.status ) {
            const samePass = isValidToken(password, user.password)
            if ( !samePass ) {
              await userDao.passChange(user._id, createHash(password))
              await disableTokenService(tokenDB._id)
              return httpResponse.Ok(res, 'Password changed successfully! Remember using the new password from now on!')
            }
            else return httpResponse.WrongInfo(res, 'Wrong user or password. Please input the correct information!')
          } else return httpResponse.NotFound(res, 'Token incorrect or expired!')
        } else return httpResponse.WrongInfo(res, 'User has Github passport. You have to reset your password at "https://github.com/setting/security" if you want to change your password. Otherwise, if you forgot your Github password you need to change it at "https://github.com/password_reset".')
      } else return httpResponse.NotFound(res, 'Incorrect user information!')
    } else return httpResponse.WrongInfo(res, 'Token not provided or incorrect!')
    } catch (error) {
      return httpResponse.ServerError(res, error.message)
    }
};