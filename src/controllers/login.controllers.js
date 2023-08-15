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
        res.render('profile', {session: req.session.user.info})
    else
        res.redirect('/login')
};

export const logout = (req, res) => {
    if ( req.session.user ) {
        delete req.session.user
        req.session.destroy( (err) => {
            if( !err ) {
                //res.json({ msg: 'Logout ok!' });
                res.redirect('/login')
            }
            else
                res.json({ msg: err });
        })
    }
    else
        res.redirect('/login')
};