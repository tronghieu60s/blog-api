import { Request, Response } from "express";
import { ResponseResult } from "../common/types";
import {
  initResponseResult,
  sendResponseSuccess,
} from "../helpers/commonFuncs";
import { sendEmail } from "../helpers/nodemailer";

export const sendEmailServer = async (req: Request, res: Response) => {
  const email = String(req.body?.email || "");
  const subject = String(req.body?.subject || "");
  const content = String(req.body?.content || "");

  sendEmail(email, subject, content)
    .then((item) => {
      const data = item ? { items: [item] } : {};
      const results: ResponseResult = initResponseResult({ data });
      return sendResponseSuccess(res, { results });
    })
    .catch((error) => {
      throw error;
    });
};
