import { Router } from 'express'

import { getAllController, getByIdController, createController, updateController, deleteByIdController, deleteAllController } from '../controllers/products.controller.js';
import fieldValidator from '../middlewares/fieldValidator.js';

const router = Router();

router.get('/products', getAllController);
router.get('/products/:pid', getByIdController);
router.post('/products', fieldValidator, createController);
router.put('/products/:pid', updateController)
router.delete('/products/:pid', deleteByIdController);
router.delete('/products', deleteAllController)

export default router;