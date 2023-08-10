import { UserModel } from "../models/user.model.js";

export default class UserDao {
    async registerUser(user) {
        try {
            const { email, password } = user;
            
            if( email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                //const newUser = await UserModel.create({...user, role: 'admin'});
                //const newUser = {...user, role: 'admin'}
                //return newUser;
                return false
            }
            else {
                const existUser = await UserModel.findOne({ email });
                if(!existUser) {
                    const newUser = await UserModel.create(user);
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
                const userExist = {...user, role: 'admin', age: 50, first_name: "ADMIN", last_name: "CODER"}
                return userExist
            }
            else {
                const userExist = await UserModel.findOne({ email, password });
                if ( userExist )
                    return userExist
                else
                    return false
            }
        } catch (error) {
            console.log(error);
        }
    };
}