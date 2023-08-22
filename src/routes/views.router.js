import { Router } from 'express'

import * as view from '../controllers/views.controller.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = Router();

router.get('/', isAuth, view.listAllProdsView);
router.get('/api', view.listAllApisView);
router.get('/api/sessions/current', view.currentSession);
router.get('/realtimeproducts', isAuth, view.listAllProdsRealtimeView);
router.get('/chat', view.chatView);
router.get('*', view.pageNotFoundView);

export default router;