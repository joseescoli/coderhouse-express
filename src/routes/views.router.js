// Incorporación de Ruteo de módulo Express
import { Router } from 'express'

// Incorporación de controladores de las vistas
import * as view from '../controllers/views.controller.js';

// Middlewares involucrados en las vistas
import { isAuth } from '../middlewares/isAuth.js';
import access from '../middlewares/endpointRoles.js';

// Mapeada constante a módulo de ruteo incorporado anteriormente
const router = Router();

router.get('/', isAuth, view.listAllProdsView); // Vista de todos los productos creados. (Sólo usuarios autenticados).
router.get('/api/sessions/current', view.currentSession); // Respuesta JSON con información de sesión iniciada. En caso de no estar logueado se informa JSON respectivo.
router.get('/loggerTest', isAuth, view.loggerTest);    // Pruebas de niveles logger winston. (Sólo usuarios autenticados).
router.get('/realtimeproducts', isAuth, view.listAllProdsRealtimeView);    // Listado de productos actualizados en tiempo real mediante websocket. (Sólo usuarios autenticados).
router.get('/chat', isAuth, access('user'), view.chatView); // Plataforma de chat del sitio. (Solo para usuarios).
router.get('*', view.pageNotFoundView); // Vista de respuesta informando ruta no encontrada.

export default router;