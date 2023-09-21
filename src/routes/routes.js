import { Router } from "express";

import router_prods from './products-router.js'; // Métodos HTTP GET, PUT, POST y DELETE para los productos
import router_carts from './carts-router.js'; // Métodos HTTP GET, PUT, POST y DELETE para los carritos
import router_views from './views.router.js' // Métodos HTTP GET que renderizan vistas en Handlebars
import router_users from './user.router.js' // Métodos HTTP GET y POST que registran o loguean a los usuarios
import router_login from './login.router.js' // Métodos HTTP GET que renderizan vistas de login de usuario en Handlebars

export default class AllRoutes {
    constructor () {
        this.router = Router();
        this.loadRoutes();
    }

    loadRoutes () {
        this.router.use('/api', router_prods)
        this.router.use('/api', router_carts)
        this.router.use('/', router_users)
        this.router.use('/', router_login)
        this.router.use('/', router_views)
    }

    getRoutes() {
        return this.router;
    }

};