//
// All 'public' ANOYMOUS routes
//
import { Router } from 'express';
import { processCode } from 'controllers/code';
import { log } from 'lib/logging';

const router = new Router();
router.use(log);

router.route('/:code').get(processCode);

export default router;
