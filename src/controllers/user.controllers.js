import UserDao from "../dao/mongodb/managers/user.dao.js"
const userDao = new UserDao();

export const registerUser = async(req, res) => {
    try {
        req.session.path = req.url

        const newUser = await userDao.registerUser(req.body)
        if ( newUser )
            res.redirect('/login');
        else
            res.redirect('/error-register')

    } catch (error) {
        console.log(error);
    }
};

export const loginUser = async(req, res) => {
    try {
        req.session.path = req.url
        //const { email, password } = req.body;

        // Constante "user" que recibe toda la información de la base de datos
        const user = await userDao.loginUser(req.body);

        if(user) {
            req.session.user = {
                loggedIn: true,
                sessionCount: 1,
                info: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    age: user.age,
                    role: user.role
                }
            }
            res.redirect('/')
            //res.render('profile', {user: user.toJSON()})
        } else
            res.redirect('/error-login')

    } catch (error) {
        console.log(error);
    }
};