import Joi from "joi";
import { ResponseCommon, ResponseError } from "../types/common";

export const checkErrorJoiValidate = ({
  error,
  value,
}: Joi.ValidationResult<any>) => {
  if (error) {
    throw error.details[0];
  }
  return value;
};

export const sendResponseSuccess = (args: ResponseCommon): ResponseCommon => ({
  status: 200,
  success: true,
  results: {
    data: {} as any,
    insertId: null,
    rowsAffected: null,
  },
  ...(args as {}),
});

export const sendResponseError = (args: ResponseError): ResponseError => ({
  status: 500,
  success: false,
  message: "Internal Server Error",
  errors: new Error(""),
  ...(args as {}),
});

export const randomIntByLength = (length: number) => {
  return Math.random().toString().slice(2, length + 2);
};
