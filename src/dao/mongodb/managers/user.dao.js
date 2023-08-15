import { UserModel } from "../models/user.model.js";
import { createHash, isValidPassword } from '../../../utils.js';


export default class UserDao {

    async registerUser(user) {
        try {
            const { email, password } = user;
            
            if( email === 'adminCoder@coder.com' && password === 'adminCod3r123')
                return false
            else {
                const existUser = await this.getByEmail(email);
                if( !existUser ) {
                    const newUser = await UserModel.create({...user, password: createHash(password)})
                    return newUser;
                } else
                    return false;
            }

        } catch (error) {
            console.log(error);
        }
    };

    async loginUser(user) {
        try {
            const { email, password } = user;
            if( email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                const userExist = {...user, role: 'admin', age: 0, first_name: "ADMIN", last_name: "CODER"}
                return userExist
            }
            else {
                const userExist = await this.getByEmail(email);
                if ( userExist ) {
                    const passValid = isValidPassword(password, userExist.password)
                    // console.log('PASS', passValid);
                    if ( !passValid ) return false
                    else return userExist
                }
                else
                    return false
            }
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
      
}