import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import Authorization from "../common/authorization";
import {
  ResponseCommon,
  ResponseError,
  ResponseResult,
  TokenParams,
} from "../common/types";
const url = require("url");

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

export const isAuthorization = (req: Request) => {
  const { url } = req;
  if (url.indexOf("/users") === 0) {
    return true;
  }
  if (url.indexOf("/posts") === 0) {
    return true;
  }
  if (url.indexOf("/comments") === 0) {
    return true;
  }
  return false;
};

export const isAllowAccess = (req: Request, login_level: number) => {
  if (login_level === 1) {
    return true;
  }

  const level = (Authorization as any)?.[login_level];
  const pathname = url.parse(req.url).pathname.split("/")?.[1];
  if (level?.[pathname]?.includes(req.method)) {
    return true;
  }

  return false;
};

export const authorizationByToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isAuthorization(req)) {
    return next();
  }

  const token = req.headers?.authorization || "Empty";
  jwt.verify(token, APP_TOKEN_JWT_KEY, (err, decoded) => {
    if (err) {
      return sendResponseError(res, { status: 401, message: "Unauthorized" });
    }
    if (decoded) {
      const token = decoded as TokenParams;
      if (token.login_ip !== req.ip) {
        return sendResponseError(res, { status: 403, message: "Forbidden" });
      }
      if (token.expire_in < Date.now()) {
        return sendResponseError(res, { status: 403, message: "Forbidden" });
      }
      if (!isAllowAccess(req, token.login_level)) {
        return sendResponseError(res, { status: 403, message: "Forbidden" });
      }
      (req as any).login = token.login;
      (req as any).login_level = token.login_level;
      return next();
    }
    return sendResponseError(res, { status: 404, message: "Not Found" });
  });
};

export const authorizationRouterUserByLevel = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as any).login_level === 1) {
    return next();
  }

  if (req.params.id === (req as any).login) {
    return next();
  }

  return sendResponseError(res, { status: 403, message: "Forbidden" });
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
