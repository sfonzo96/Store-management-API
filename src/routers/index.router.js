import { Router } from 'express'

import productsRouter from './products.router.js'
import cartsRouter from './carts.router.js'
import viewsRouter from './views.router.js'
import usersRouter from './users.router.js'
import passportLocalRouter from './passportLocal.router.js'
/* import authRouter from './auth.router.js' */

const router = Router();

router.use('/api/products', productsRouter);
router.use('/api/carts', cartsRouter);
router.use('/api/users', usersRouter);
router.use('/', viewsRouter);
router.use('/api/passport', passportLocalRouter);
/* router.use('/api/auth', authRouter) */

export default router;