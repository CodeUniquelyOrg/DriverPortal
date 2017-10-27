//
// Vehicle sharing routes
//
import { Router } from 'express';
import * as controller from 'controllers/share';
import { log } from 'lib/logging';

const router = new Router();
router.use(log);

/* eslint-disable no-useless-escape */

// Sharing
router.route('/:vehicleId').get(controller.generateCode);
router.route('/:code').put(controller.processShareCode);
router.route('/:vehicleId').delete(controller.stopSharing);

/* eslint-enable no-useless-escape */

export default router;
