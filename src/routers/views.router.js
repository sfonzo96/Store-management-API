import express from "express";
import * as viewsController from '../controllers/views.controller.js'

const viewsRouter = express.Router();

viewsRouter.get('/chat', viewsController.getChat)

viewsRouter.get("/", viewsController.getHome);

viewsRouter.get('/cart/:cartID', viewsController.getCart)

viewsRouter.get('/products', viewsController.getProducts);

viewsRouter.get("/realtimeproducts", viewsController.getRealTimeProducts);

export default viewsRouter;