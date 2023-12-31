// Incorporando módulo de Ruteo de Express
import { Router } from 'express'

// Controlador de gestión de carritos
import { getAllController, getByIdController, createController, updateController, deleteProdController, deleteByIdController, emptyCartController, updateProdCantController, addProdsController, purchaseController } from '../controllers/carts.controller.js';

// Incorporación de Middlewares
import access from '../middlewares/endpointRoles.js';
import { isAuth } from '../middlewares/isAuth.js';

// Inicialización de constante router del módulo importado
const router = Router();

// Definición de ruteos de carritos, sus métodos y sus middlewares. Sólo funcionan estando autenticado.
router.get('/carts', isAuth, access('admin'), getAllController);    // Lista todos los carritos (Sólo administradores)
router.get('/carts/:cid', isAuth, getByIdController);   // Obtiene carrito por ID
router.post('/carts', isAuth, access('user', 'premium'), createController);    // Alta de nuevo carrito (Sólo usuarios y rol premium)
router.post('/carts/:cid/product/:pid', isAuth, access('user', 'premium'), updateController);  // Alta o sumatoria de nuevo producto por ID en carrito preexistente desde su ID. (Sólo usuarios y rol premium)
router.put('/carts/:cid/product/:pid', isAuth, access('user', 'premium'), updateProdCantController);   // Agregado de cantidad de productos definida en carrito preexistente por body. (Sólo usuarios y rol premium)
router.delete('/carts/:cid/product/:pid', isAuth, access('user', 'premium'), deleteProdController);    // Borrado de producto por ID de carrito preexistente desde ID. (Sólo usuarios y rol premium)
router.put('/carts/:cid', isAuth, access('user', 'premium'), addProdsController);  // Agregado de nuevos productos por array en carrito preexistente desde ID por body. (Sólo usuarios y rol premium)
router.put('/carts/:cid/purchase', isAuth, access('user', 'premium'), purchaseController);  // Finalización de compra de los productos elegidos en el carrito preexistente desde ID. (Sólo usuarios y rol premium)
router.delete('/carts/:cid', isAuth, access('user', 'premium'), emptyCartController); // Borrado de productos del carrito preexistente desde ID. (Sólo usuarios y rol premium)
router.delete('/carts/:cid/delete', isAuth, access('admin'), deleteByIdController);  // Borrado de carrito preexistente desde ID (Sólo administradores)

export default router;