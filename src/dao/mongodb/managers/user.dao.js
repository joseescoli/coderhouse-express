import { logger } from "../../../utils/logger.js";
import { UserModel } from "../models/user.model.js";
import { createHash, isValidPassword } from '../../../utils/utils.js';
import CartsDaoMongoDB from "./carts.dao.js";
const cartDao = new CartsDaoMongoDB()

export default class UserDao {

    async getall() {
        try {
          const users = await UserModel.find({}, {_id: 1, email: 1, first_name: 1, last_name: 1}).lean()

          if( !users )
            return false
          else
            return users
        } catch (error) {
          logger.error(error.message)
        }
    };

    async registerUser(user) {
        try {
            const { email, password } = user;            
            const existUser = await this.getByEmail(email);
            if( !existUser ) {
                const newUser = await UserModel.create({...user, password: createHash(password)})
                return newUser;
            } else
                return false;

        } catch (error) {
          logger.error(error.message)
        }
    };

    async loginUser(user) {
        try {
            const { email, password } = user;
            const userExist = await this.getByEmail(email);
            if ( userExist ) {
                const passValid = isValidPassword(password, userExist.password)
                // logger.debug('PASS', passValid);
                if ( !passValid ) return false
                else return userExist
            }
            else
                return false
        } catch (error) {
          logger.error(error.message)
        }
    };

    async getById(id){
        try {
          const userExist = await UserModel.findById(id)
          if(userExist) return userExist
          else return false
        } catch (error) {
          logger.error(error.message)
          // throw new Error(error)
        }
      }
    
      async getByEmail(email){
        try {
          const userExist = await UserModel.findOne({email}); 
          // logger.debug(userExist);
          if(userExist) return userExist
          else return false
        } catch (error) {
          logger.error(error.message)
          throw new Error(error)
        }
      }

      async newCart(email){
        try {
          const user = await UserModel.findOne({email}); 
          // logger.debug(userExist);
          if(user) {
            user.cart = (await cartDao.createCart())._id
            user.save()
            return true
          }
          else return false
        } catch (error) {
          logger.error(error.message)
          throw new Error(error)
        }
      }

      async passChange(id, pass){
        try {
          const user = await this.getById(id)
          if(user) {
            user.password = pass
            user.save()
            return true
          }
          else return false
        } catch (error) {
          logger.error(error.message)
          throw new Error(error)
        }
      }

      async changeRoleById(id) {
        try {
          const user = await this.getById(id)
          if( user && ( user.role === 'premium' || user.role === 'user') ) {
            const role = user.role === 'user' ? 'premium' : 'user'
            user.role = role
            user.save()
            return role
          }
          else return false
        } catch (error) {
          logger.error(error.message)
          throw new Error(error)
        }
      }

      async checkDocStatus(id) {
        try {
          // https://stackoverflow.com/questions/9939760/how-do-i-convert-an-integer-to-binary-in-javascript
          let status = {}
          const user = await this.getById(id)
          if( user ) {
            status.id = user.documents.some( doc => doc.name === 'ID' )
            status.address = user.documents.some( doc => doc.name === 'Address' )
            status.accounting = user.documents.some( doc => doc.name === 'Accounting' )
            return status
          }
          else return false
        } catch (error) {
          logger.error(error.message)
          throw new Error(error)
        }
      }

}