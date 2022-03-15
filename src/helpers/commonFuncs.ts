import { Response } from "express";
import { ResponseCommon, ResponseError, ResponseResult } from "../types/commonTypes";

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

/* Common Functions */

export const randomIntByLength = (length: number) => {
  return Math.random()
    .toString()
    .slice(2, length + 2);
};
