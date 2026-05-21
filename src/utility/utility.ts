import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import type { ApiErrorResponse, ApiSuccessResponse, AuthTokenPayload, AuthUser } from "../types/types.js";

export const sendSuccess = <T>(
	res: Response,
	statusCode: number,
	message: string,
	data: T,
) => {
	return res.status(statusCode).json({
		success: true,
		message,
		data,
	} satisfies ApiSuccessResponse<T>);
};

export const sendError = (
	res: Response,
	statusCode: number,
	message: string,
	errors?: unknown,
) => {
	const payload: ApiErrorResponse = { success: false, message };

	if (errors !== undefined) {
		payload.errors = errors;
	}

	return res.status(statusCode).json(payload);
};

export const signAuthToken = (payload: AuthUser) => {
	return jwt.sign(payload, config.jwt_secret, { expiresIn: "7d" });
};

export const verifyAuthToken = (token: string) => {
	return jwt.verify(token, config.jwt_secret) as AuthTokenPayload;
};

export const globalErrorHandler = (
	error: unknown,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (res.headersSent) {
		return next(error);
	}

	const message = error instanceof Error ? error.message : "Internal server Error";

	return res.status(500).json({
		success: false,
		message,
	});
};
