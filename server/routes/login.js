//
// All 'public' ANOYMOUS routes
//
import { Router } from 'express';
import { login, register, forgot } from 'controllers/auth';
import { log } from 'lib/logging';

const router = new Router();
router.use(log);

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/forgot').post(forgot);

export default router;
