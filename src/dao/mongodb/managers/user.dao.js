import { UserModel } from "../models/user.model.js";
import { createHash, isValidPassword } from '../../../utils.js';
import CartsDaoMongoDB from "./carts.dao.js";
const cartDao = new CartsDaoMongoDB()

export default class UserDao {

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
            console.log(error);
        }
    };

    async loginUser(user) {
        try {
            const { email, password } = user;
            const userExist = await this.getByEmail(email);
            if ( userExist ) {
                const passValid = isValidPassword(password, userExist.password)
                // console.log('PASS', passValid);
                if ( !passValid ) return false
                else return userExist
            }
            else
                return false
        } catch (error) {
            console.log(error);
        }
    };

    async getById(id){
        try {
          const userExist = await UserModel.findById(id)
          if(userExist) return userExist
          else return false
        } catch (error) {
          console.log(error)
          // throw new Error(error)
        }
      }
    
      async getByEmail(email){
        try {
          const userExist = await UserModel.findOne({email}); 
          // console.log(userExist);
          if(userExist) return userExist
          else return false
        } catch (error) {
          console.log(error)
          throw new Error(error)
        }
      }

      async newCart(email){
        try {
          const user = await UserModel.findOne({email}); 
          // console.log(userExist);
          if(user) {
            user.cart = (await cartDao.createCart())._id
            user.save()
            return true
          }
          else return false
        } catch (error) {
          console.log(error)
          throw new Error(error)
        }
      }
      
}