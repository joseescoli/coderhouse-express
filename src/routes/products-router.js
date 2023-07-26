import { Router } from 'express'

import { getAllController, getByIdController, createController, updateController, deleteByIdController, deleteAllController } from '../controllers/products.controller.js';
import fieldValidator from '../middlewares/fieldValidator.js';

const router = Router();

router.get('/api/products', getAllController);
router.get('/api/products/:pid', getByIdController);
router.post('/api/products', fieldValidator, createController);
router.put('/api/products/:pid', updateController)
router.delete('/api/products/:pid', deleteByIdController);
router.delete('/api/products', deleteAllController)

export default router;