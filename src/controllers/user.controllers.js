// Clase de usuarios
import UserDao from "../dao/mongodb/managers/user.dao.js"
const userDao = new UserDao();

// Funciones para el manejo de contraseñas
import { createTokenService, disableTokenService, getTokenByUserService } from "../services/token.service.js"
import { isValidPassword as isValidToken, createHash, resetToken } from "../utils/utils.js";

// Detección del User-Agent
import { detectBrowser } from "../utils/utils.js";

// Módulo de respuesta estandarizada y diccionario de errores
import { HttpResponse } from "../utils/http.responses.js"
const httpResponse = new HttpResponse()
import errorsConstants from "../utils/errors/errors.constants.js";

// Servicio de envío de correos
import { sendMailEthereal } from "../services/email.services.js";

// Variable ruta absoluta
import { __dirname } from "../path.js";

// Borrado de archivos
import { deleteFilesInDir } from "../utils/utils.js";

// Variables de entorno
import config from "../config.js";

// Servicio de productos. Cambio de owner de producto a 'admin' y ver producto por ID
import { changeProdOwnerService, getByIdService } from "../services/products.services.js";

// Declaración de funciones debajo
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
          user.last_connection = Date.now()
          user.save()
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
        const user = await userDao.getById(req.session.passport.user)
        user.last_connection = Date.now()
        user.save()
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

export const userList = async (req, res) => {
  try {
      const users = await userDao.getall()
      if ( users ) {
      const list = users.map( user => {
        const userObj = user.toObject()
        userObj.admin = user.role === 'admin'
        userObj.loggedIn = ( userObj._id.toString() === req.session.passport.user )
        return userObj
        })
        req.logger.info(`Endpoint showing ${users.length} users in DB.`)
        detectBrowser(req.get('User-Agent')) ? res.render('users', {list}) : httpResponse.Ok(res, list)
      }
      else
        return httpResponse.NotFound(res, errorsConstants.USERS_NOT_FOUND)
  } catch (error) {
    return httpResponse.ServerError(res, error.message)
  }
};

export const delUserById = async (req, res) => {
  try {
    const ID = req.params?.uid ? String(req.params.uid) : false
    const user = await userDao.getById(ID)
    if ( user ) {
      if ( ID && ID !== req.session.passport.user ) {
        // Se cambia debajo el producto del que el usuario es owner a 'admin'
        await changeProdOwnerService(user.email)
        // Borrado de archivos de usuario a eliminar
        if (user.documents.length > 0)
          user.documents.map( file => deleteFilesInDir(ID, file.reference) )
        const response = await userDao.deleteById(ID)
        if ( response ) {
            req.logger.info(`User ${ID} removed!`)
            // detectBrowser(req.get('User-Agent')) ? res.redirect('/api/users') : httpResponse.Ok(res, `User ${ID} removed!`)
            return httpResponse.Ok(res, `User ${ID} removed!`)
        }
        else
          return httpResponse.NotFound(res, errorsConstants.USER_NOT_FOUND)
      } else return httpResponse.WrongInfo(res, errorsConstants.ID_WRONG)
    } else
      return httpResponse.NotFound(res, errorsConstants.USER_NOT_FOUND)
  } catch (error) {
    return httpResponse.ServerError(res, error.message)
  }
};

export const usersToDelete = async (req, res) => {
  try {
      const users = await userDao.getall()
      const dateNow = new Date()
      const filterDate = dateNow.setDate(dateNow.getDate() - config.DAYS_TO_REMOVE_INACTIVE_USERS)
      const usersToRemove = users.filter( user => user.last_connection < filterDate )
      if ( usersToRemove ) {
        const IDs = usersToRemove.length === 1 ? usersToRemove._id.toString() : usersToRemove.map( user => user._id.toString())
        const products = IDs ? await getByIdService(IDs) : false
        if ( products ) {
          // Se cambia debajo el o los productos del que el usuario es owner a 'admin'
          products.forEach( async prod => await changeProdOwnerService(prod.owner) )
          // Borrado de archivos de usuario a eliminar
          usersToRemove.forEach( user => {
            if (user.documents.length > 0)
              user.documents.map( file => deleteFilesInDir(user._id, file.reference) )
          })
        }
        usersToRemove.length === 1 ? await userDao.deleteById(IDs) : await userDao.deleteManyIds(IDs)
        req.logger.info(`${usersToRemove.length} ${usersToRemove.length === 1 ? 'user' : 'users'} removed!`)
        usersToRemove.map( async user => await sendMailEthereal( { destination: user.email, service: 'userDeleted', name: user.first_name } ) )
        detectBrowser(req.get('User-Agent')) ? res.redirect('/api/users') : httpResponse.Ok(res, usersToRemove)
        // return httpResponse.Ok(res, IDs)
      } else
        return httpResponse.NotFound(res, errorsConstants.USERS_NOT_FOUND)
  } catch (error) {
    return httpResponse.ServerError(res, error.message)
  }
};

export const changeRolePremium = async (req, res) => {
  try {
      const ID = req.params?.uid ? String(req.params.uid) : false
      const user = await userDao.getById(ID)
      if ( user && user.role === 'user' ) {
        const status = await userDao.checkDocStatus(ID)
        const validUser = ( status.id && status.address && status.accounting )
        if ( ID && ID !== req.session.passport.user ) {
          if ( validUser ) {
            const response = await userDao.changeRoleById(ID)
            if ( response ) {
                req.logger.info(`Role for user ${ID} changed to ${response}!`)
                detectBrowser(req.get('User-Agent')) ? res.redirect('/api/users') : httpResponse.Ok(res, `Role for user ${ID} changed to ${response}!`)
            }
            else
              detectBrowser(req.get('User-Agent')) ? res.redirect(`/api/users`) : httpResponse.NotFound(res, errorsConstants.USER_NOT_FOUND)
          } else
            detectBrowser(req.get('User-Agent')) ? res.redirect(`/api/users/${ID}/documents`) : httpResponse.WrongInfo(res, `User ID ${ID} needs to upload proper documentation such as "Identification", "Home address certificate" & "Account balance" prior to change to "Premium" role!`)
        } else return httpResponse.WrongInfo(res, errorsConstants.ID_WRONG)
      } else
        detectBrowser(req.get('User-Agent')) ? res.redirect(`/api/users`) : httpResponse.NotFound(res, errorsConstants.USER_NOT_FOUND)
  } catch (error) {
    return httpResponse.ServerError(res, error.message)
  }
};

export const uploadDocs = async (req, res) => {
  try {
      const ID = req.params?.uid ? String(req.params.uid) : false
      if ( req.file ) {
        // Se almacena archivo almacenado desde formulario de subida de archivos en objeto 'file'
        const file = { name: req.body.doctype, reference: req.file.path }
        const user = await userDao.getById(ID)
        if ( user ) {
          const duplicateDoc = user.documents.some( doc => doc.reference === req.file.path )
          if ( duplicateDoc )
            return httpResponse.WrongInfo(res, `Document ${req.file.path} already uploaded! Try a different file!`)
          else {
            // Se almacena la referencia del archivo subido en el atributo documents del usuario
            user.documents.push( file )
            user.save()
            detectBrowser(req.get('User-Agent')) ? res.redirect(`/api/users/${ID}/documents`) : httpResponse.Ok(res, `Upload of documents for user ${ID} finished!`)
          }
        }
        else
            return httpResponse.NotFound(res, errorsConstants.USER_NOT_FOUND)
      }
      else
        detectBrowser(req.get('User-Agent')) ? res.redirect(`/api/users/${ID}/documents`) : httpResponse.WrongInfo(res, 'Upload process incomplete! Please, try again!')
  } catch (error) {
    return httpResponse.ServerError(res, error.message)
  }
};

export const uploadDocsView = async (req, res) => {
  try {
      const ID = req.params?.uid ? String(req.params.uid) : false
        const user = await userDao.getById(ID)
        // Se comprueba que el usuario exista y tenga rol 'user'
        const validUser = user && user.role === 'user'
        if ( validUser ) {
          // Se almacena el estado de los documentos subidos. La vista quitará de la selección el documento ya subido.
          const status = await userDao.checkDocStatus(ID)
          detectBrowser(req.get('User-Agent')) ? res.render('uploads', { ID, status } ) : httpResponse.Ok(res, `Please use the [POST] method at /api/users/${ID}/documents to upload files!`)
        }
        else
          return httpResponse.NotFound(res, errorsConstants.USER_NOT_FOUND)
  } catch (error) {
    return httpResponse.ServerError(res, error.message)
  }
};