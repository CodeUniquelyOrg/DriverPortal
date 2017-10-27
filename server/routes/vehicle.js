//
// All 'public' ANOYMOUS routes
//
import { Router } from 'express';
import * as controller from 'controllers/vehicle';
import { log } from 'lib/logging';

const router = new Router();

router.use(log);
router.route('/:vehicleId').put(controller.registerVehicle);
router.route('/:vehicleId').delete(controller.removeVehicle);

export default router;
