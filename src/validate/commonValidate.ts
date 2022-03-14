import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { sendResponseError } from "../helpers/commonFuncs";

export const joiCommonValidate = (schema: Joi.ObjectSchema<any>) => {
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
