//
// User Routes
//
import { Router } from 'express';
import { get, update } from 'controllers/user';
import { log } from 'lib/logging';

const router = new Router();
router.use(log);

// get all users - should be an ADMIN only route
// router.route('/').put( lib/middleware.limitToAdmin, getAllUsers );

router.route('/me').get(get);
router.route('/me').put(update);

export default router;
