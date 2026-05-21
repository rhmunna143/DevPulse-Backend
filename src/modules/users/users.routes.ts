import { Router } from "express";
import { signup, login } from "./users.controller.js";

export const usersRouter = Router();

usersRouter.post("/auth/signup", signup);
usersRouter.post("/auth/login", login);