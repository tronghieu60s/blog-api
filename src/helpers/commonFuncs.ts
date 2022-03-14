import Joi from "joi";
import { ResponseCommon, ResponseError, ResponseResult } from "../types/common";

/* Validate Functions */

export const checkErrorJoiValidate = ({
  error,
  value,
}: Joi.ValidationResult<any>) => {
  if (error) {
    throw error.details[0];
  }
  return value;
};

/* Response Functions */

export const sendResponseResult = (args?: ResponseResult): ResponseResult => ({
  data: {},
  insertId: null,
  rowsAffected: 0,
  ...(args as {}),
});

export const sendResponseSuccess = (args?: ResponseCommon): ResponseCommon => ({
  status: 200,
  success: true,
  results: sendResponseResult(),
  ...(args as {}),
});

export const sendResponseError = (args?: ResponseError): ResponseError => ({
  status: 500,
  success: false,
  message: "Internal Server Error",
  errors: new Error(""),
  ...(args as {}),
});

/* Common Functions */

export const randomIntByLength = (length: number) => {
  return Math.random()
    .toString()
    .slice(2, length + 2);
};
