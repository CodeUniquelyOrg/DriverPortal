//
// Get 'my' vehicle(s) histor[y|ies] route
//
import { Router } from 'express';
import * as controller from 'controllers/history';
import { log } from 'lib/logging';

const router = new Router();
router.use(log);

// Get My history
router.route('/me').get(controller.getMyHistory);

export default router;
