// Incorporando módulo de Ruteo de Express
import { Router } from 'express'

// Controlador de gestión de productos
import { getAllController, getByIdController, createController, updateController, deleteByIdController, deleteAllController, mockProducts } from '../controllers/products.controller.js';

// Incorporación de Middlewares
import fieldValidator from '../middlewares/fieldValidator.js'; // Valida campos correctos en creación de producto
import access from '../middlewares/endpointRoles.js'; // Concede acceso al perfil de usuario indicado
import { isAuth } from '../middlewares/isAuth.js'; // Sólo permite acceso si es usuario autenticado. De lo contrario se conduce la sesión al /login

// Inicialización de constante router del módulo importado
const router = Router();

// Definición de ruteos de productos, sus métodos y sus middlewares. Sólo funcionan estando autenticado.
router.get('/products', isAuth, getAllController);  // Lista todos los productos
router.get('/products/mockingproducts', isAuth, mockProducts); // Muestra sin guardar en la base de datos 100 productos de prueba
router.get('/products/:pid', isAuth, getByIdController);    // Obtiene producto por ID
router.post('/products', fieldValidator, isAuth, access('admin', 'premium'), createController);    // Alta de nuevo producto (Sólo administradores y premium)
router.put('/products/:pid', isAuth, access('admin', 'premium'), updateController) // Actualiza producto desde el cuerpo del request indicando ID en la ruta (Sólo administradores y premium como owners del producto)
router.delete('/products/:pid', isAuth, access('admin', 'premium'), deleteByIdController); // Elimina producto por ID (Sólo administradores y premium como owners del producto)
router.delete('/products', isAuth, access('admin', 'premium'), deleteAllController)    // Elimina todos los productos (Sólo administradores y premium como owners del producto)

export default router;