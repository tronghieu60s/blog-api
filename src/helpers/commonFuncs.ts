import { Request, Response, NextFunction } from "express";
import { ResponseCommon, ResponseError, ResponseResult } from "../types/commonTypes";
import Joi from "joi";

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
