import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { AuthServices } from "./users.services.js";
import {
  sendError,
  sendSuccess,
  signAuthToken,
} from "../../utility/utility.js";
import type { IUser } from "./users.interfaces.js";

const buildUserResponse = (user: IUser) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: user.created_at,
  updated_at: user.updated_at,
});

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, role = "contributor" } = req.body;

  if (!name || !email || !password) {
    return sendError(res, 400, "name, email and password are required");
  }

  const existing = await AuthServices.findUserByEmail(email);
  if (existing) return sendError(res, 409, "Email already in use");

  const hash = await bcrypt.hash(password, 10);
  const user = await AuthServices.createUser(name, email, hash, role);

  return sendSuccess(
    res,
    201,
    "User registered successfully",
    buildUserResponse(user),
  );
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendError(res, 400, "email and password required");
  }

  const user = await AuthServices.findUserByEmail(email);

  if (!user) {
    return sendError(res, 401, "invalid credentials");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return sendError(res, 401, "invalid credentials");
  }

  const token = signAuthToken({
    id: user.id,
    name: user.name,
    role: user.role,
  });

  return sendSuccess(res, 200, "Login successful", {
    token,
    user: buildUserResponse(user),
  });
};
