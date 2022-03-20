import { Request, Response } from "express";
import { ResponseResult } from "../common/types";
import {
  initResponseResult,
  sendResponseError,
  sendResponseSuccess,
} from "../helpers/commonFuncs";
import { sendEmail } from "../helpers/nodemailer";
import UploadsModel from "../models/uploadsModel";

export const uploadServer = async (req: Request, res: Response) => {
  const files = (req.files as Array<Express.Multer.File>)?.map((o) => ({
    user_id: (req as any).login,
    upload_filename: o.filename,
    upload_title: o.originalname,
    upload_path: o.path,
    upload_mimetype: o.mimetype,
    upload_size: o.size,
  }));
  if (files?.length === 0) {
    return sendResponseError(res, { status: 400, message: "No Files" });
  }

  const items = await UploadsModel.insertMany(files);
  const data = files ? { items } : {};
  const results: ResponseResult = initResponseResult({
    data,
    rowsAffected: items.length,
  });
  return sendResponseSuccess(res, { results });
};

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
