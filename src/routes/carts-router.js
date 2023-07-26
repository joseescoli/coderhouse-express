import { Router } from 'express'
import { getAllController, getByIdController, createController, updateController, deleteProdController, deleteByIdController } from '../controllers/carts.controller.js';
const router = Router();

// Ruta TESTING todos los carritos
router.get('/api/carts', getAllController);

// Ruta por ID de carrito
router.get('/api/carts/:cid', getByIdController);

// Alta de nuevo carrito
router.post('/api/carts', createController);

// Alta o sumatoria de nuevo producto en carrito preexistente
router.post('/api/carts/:cid/product/:pid', updateController);

// Borrado de producto en carrito preexistente
router.delete('/api/carts/:cid/product/:pid', deleteProdController);

// Borrado de carrito preexistente
router.delete('/api/carts/:cid', deleteByIdController);

export default router;