import type { NextFunction, Request, Response } from "express";
import { sendError, verifyAuthToken } from "../utility/utility.js";
import type { UserRole } from "../modules/users/users.interfaces.js";

const extractToken = (authorizationHeader?: string) => {
  if (!authorizationHeader) {
    return null;
  }

  if (authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.trim();
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    return sendError(res, 401, "missing or invalid token");
  }

  try {
    const decoded = verifyAuthToken(token);

    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    return sendError(res, 401, "missing or invalid token");
  }
};

export const authorizeRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 403, "forbidden");
    }

    return next();
  };
};
