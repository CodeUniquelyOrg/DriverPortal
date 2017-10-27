// ==============================================================
// Written by steve saxton <steves@codeuniquely.co.uk>
// Copyright (c) 2017 Code Uniquely Ltd.
// API Routes
// ==============================================================
import { Router } from 'express';
import { decorate, authorize, termsAcceptedOnly } from 'lib/auth';
import { log } from 'lib/logging';
import { accessControlheaders } from 'lib/headers';

// import favIcon from './favicon';
// import infoRoutes from './info.route';
import codeRoutes from './code';
import loginRoutes from './login';
import usersRoutes from './user';
import shareRoutes from './share';
import historyRoutes from './history';
// import driveoverRoutes from './driveover';
import vehicleRoutes from './vehicle';

// *********************************************
const router = new Router(/* { mergeParams: true } */);

// reusable logger for routing looking at the requests (inbound)
router.use(log);

// declare what headers we will accept
router.use(accessControlheaders);

// ================================================================
// decorate ALL requests with info from JWT & MongoDb is available,
// adding req.jwt and/or req.user (annoymous requests = neither)...
// ===========================x=====================================
router.use(decorate);

// requests for [$root]/auth/login [$root]/auth/register and [$root]/auth/forgot
router.use('/auth', loginRoutes);

// [$root]/code
// if a code comes in on requst - what do we do with it
router.use('/code', codeRoutes);

// router.use('/driveover', driveoverRoutes);
router.use('/history', historyRoutes);

// 'user/me' stuff - can be called anonymously - BUT will have very little in the response
router.use('/user', usersRoutes);

// ===========================x=====================================
// Add Initialize Authentication Middleware from here on in
// ===========================x=====================================
// router.use(authorize);

// 'user/me' stuff - update version of the URL
// router.use('/user', usersRoutes);

// must have a account (login) thus registered in order to logout
// app.use(registeredOnly);

// router.use('/history', historyRoutes);

// 2nd level 'Gate' - you must also have these criteria
router.use(termsAcceptedOnly);

// 'history/me' stuff
router.use('/share', shareRoutes);
router.use('/vehicle', vehicleRoutes);

// 2nd level 'Gate' - you must also have these criteria
// app.use(managersOnly);

// 3rd level 'Gate' - you must also have these criteria
// app.use(adminOnly);

// *********************************************
// FINALLY - no matching route was found - 'not found' handler
// router.use(notfound);

export default router;
