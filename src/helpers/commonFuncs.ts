import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { ResponseCommon, ResponseError, ResponseResult } from "./commonTypes";

const { APP_TOKEN_JWT_KEY = "" } = process.env;

/* Common Functions */

export const randomIntByLength = (length: number) => {
  return Math.random()
    .toString()
    .slice(2, length + 2);
};

export const joiCommonValidateQuery = (schema: Joi.ObjectSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query);
    if (error) {
      const message = error?.details[0]?.message;
      return sendResponseError(res, { status: 404, message });
    }
    next();
  };
};

export const joiCommonValidateBody = (schema: Joi.ObjectSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errors = error?.details[0];
      const message = error?.details[0]?.message;
      return sendResponseError(res, { status: 400, message, errors });
    }
    next();
  };
};

export const basicAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.url.indexOf("/users") === -1) {
    return next();
  }

  const token = req.headers?.authorization || "Empty";
  jwt.verify(token, APP_TOKEN_JWT_KEY, function (err, decoded) {
    if (err) {
      return sendResponseError(res, { status: 401, message: "Unauthorized" });
    }
    if (decoded) {
      if ((decoded as any).login_ip !== req.ip) {
        return sendResponseError(res, { status: 403, message: "Forbidden" });
      }
      if ((decoded as any).expire_in < Date.now()) {
        return sendResponseError(res, { status: 403, message: "Forbidden" });
      }
      (req as any).login = (decoded as any).login;
      return next();
    }
    return sendResponseError(res, { status: 404, message: "Not Found" });
  });
};

/* Response Functions */

export const initResponseResult = (args?: ResponseResult): ResponseResult => ({
  data: {},
  insertId: null,
  rowsAffected: 0,
  ...(args as {}),
});

export const sendResponseSuccess = (res: Response, args?: ResponseCommon) => {
  const response = {
    status: 200,
    success: true,
    results: initResponseResult(),
    ...(args as {}),
  };
  return res.status(response.status).json(response);
};

export const sendResponseError = (res: Response, args?: ResponseError) => {
  const response = {
    status: 500,
    success: false,
    message: "Internal Server Error",
    errors: new Error(""),
    ...(args as {}),
  };
  return res.status(response.status).json(response);
};
