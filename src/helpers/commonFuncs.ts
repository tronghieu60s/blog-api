import { ResponseCommon, ResponseError } from "../types/common";

export const sendResponseSuccess = (args: ResponseCommon): ResponseCommon => ({
  status: 200,
  success: true,
  message: "",
  ...(args as {}),
});

export const sendResponseError = (args: ResponseError): ResponseError => ({
  status: 500,
  success: false,
  message: "Internal Server Error",
  errors: new Error(""),
  ...(args as {}),
});
