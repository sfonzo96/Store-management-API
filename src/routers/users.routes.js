import express from "express";
import isAuthenticated from "../middlewares/auth.middleware.js";
import * as userController from "../controllers/users.constroller.js";

const usersRouter = express.Router();

usersRouter.post("/", userController.createUser)
usersRouter.get("/:email", isAuthenticated, userController.getUser);
//TODO Update user endpoints

export default usersRouter;
