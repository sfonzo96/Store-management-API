import { Router } from 'express';

import productsRouter from './products.routes.js';
import cartsRouter from './carts.routes.js';
import viewsRouter from './views.routes.js';
import usersRouter from './users.routes.js';
import passportLocalRouter from './passportLocal.routes.js';
import githubRouter from './github.routes.js';
/* import authRouter from './auth.router.js' */

const router = Router();

router.use('/api/products', productsRouter);
router.use('/api/carts', cartsRouter);
router.use('/api/users', usersRouter);
router.use('/', viewsRouter);
router.use('/api/passport', passportLocalRouter);
router.use('/api/github', githubRouter);
/* router.use('/api/auth', authRouter) */

export default router;
