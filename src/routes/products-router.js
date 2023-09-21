// Incorporando módulo de Ruteo de Express
import { Router } from 'express'

// Controlador de gestión de productos
import { getAllController, getByIdController, createController, updateController, deleteByIdController, deleteAllController } from '../controllers/products.controller.js';

// Incorporación de Middlewares
import fieldValidator from '../middlewares/fieldValidator.js'; // Valida campos correctos en creación de producto
import access from '../middlewares/endpointRoles.js'; // Concede acceso al perfil de usuario indicado
import { isAuth } from '../middlewares/isAuth.js'; // Sólo permite acceso si es usuario autenticado. De lo contrario se conduce la sesión al /login

// Inicialización de constante router del módulo importado
const router = Router();

// Definición de ruteos de productos, sus métodos y sus middlewares. Sólo funcionan estando autenticado.
router.get('/products', isAuth, getAllController);  // Lista todos los productos
router.get('/products/:pid', isAuth, getByIdController);    // Obtiene producto por ID
router.post('/products', fieldValidator, isAuth, access('admin'), createController);    // Alta de nuevo producto (Sólo administradores)
router.put('/products/:pid', isAuth, access('admin'), updateController) // Actualiza producto desde el cuerpo del request indicando ID en la ruta (Sólo administradores)
router.delete('/products/:pid', isAuth, access('admin'), deleteByIdController); // Elimina producto por ID (Sólo administradores)
router.delete('/products', isAuth, access('admin'), deleteAllController)    // Elimina todos los productos (Sólo administradores)

export default router;