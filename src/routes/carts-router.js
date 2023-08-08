import { Router } from 'express'
import { getAllController, getByIdController, createController, updateController, deleteProdController, deleteByIdController, emptyCartController, updateProdCantController, addProdsController } from '../controllers/carts.controller.js';
const router = Router();

// Ruta TESTING todos los carritos
router.get('/carts', getAllController);

// Ruta por ID de carrito
router.get('/carts/:cid', getByIdController);

// Alta de nuevo carrito
router.post('/carts', createController);

// Alta o sumatoria de nuevo producto en carrito preexistente
router.post('/carts/:cid/product/:pid', updateController);

// Agregado de cantidad de productos definida en carrito preexistente por body
router.put('/carts/:cid/product/:pid', updateProdCantController);

// Borrado de producto de carrito preexistente
router.delete('/carts/:cid/product/:pid', deleteProdController);

// Agregado de nuevos productos por array en carrito preexistente por body
router.put('/carts/:cid', addProdsController);

// Borrado de carrito preexistente
//router.delete('/api/carts/:cid', deleteByIdController);

// Borrado de productos del carrito preexistente
router.delete('/carts/:cid', emptyCartController);

export default router;