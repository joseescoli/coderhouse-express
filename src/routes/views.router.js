import { Router } from 'express'

import * as view from '../controllers/views.controller.js';

const router = Router();

router.get('/', view.listAllProdsView);
router.get('/api', view.listAllApisView);
router.get('/realtimeproducts', view.listAllProdsRealtimeView);
router.get('/chat', view.chatView);
router.get('*', view.pageNotFoundView);

export default router;