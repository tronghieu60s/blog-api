import { Request, Response } from "express";
import fs from "fs";
import { ResponseResult } from "../common/types";
import {
  initResponseResult,
  sendResponseError,
  sendResponseSuccess,
} from "../helpers/commonFuncs";
import UploadsModel from "../models/uploadsModel";

const { APP_LIMIT_DEFAULT_PAGINATION } = process.env;

export const getUpload = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await UploadsModel.findById(id).exec();
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const getUploads = async (req: Request, res: Response) => {
  const q = String(req.query?.q || "");
  const search = String(req.query?.search || "");
  const page = Number(req.query?.page || 1);
  const pageSize = Number(req.query?.pageSize || APP_LIMIT_DEFAULT_PAGINATION);
  const order = String(req.query?.order || "desc");
  const orderby = String(req.query?.orderby || "updated_at");

  const skip = pageSize * page - pageSize;
  const sort = { [orderby]: order };

  const query = search ? { [search]: new RegExp(q, "i") } : {};
  const items = await UploadsModel.find(
    query,
    {},
    { skip, limit: pageSize, sort }
  ).exec();
  const total = await UploadsModel.countDocuments(query);

  const pageTotal = Math.ceil(total / pageSize);
  const nextPage = page >= pageTotal ? null : page + 1;
  const previousPage = page <= 1 ? null : page - 1;

  const data = {
    items,
    total,
    pageTotal,
    page,
    pageSize,
    nextPage,
    previousPage,
  };

  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const createUploads = async (req: Request, res: Response) => {
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

export const updateUpload = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await UploadsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const deleteUploads = async (req: Request, res: Response) => {
  const { files } = req.body;
  if (!files) {
    return sendResponseError(res, { status: 400, message: "No Files" });
  }

  const items = await UploadsModel.find({ _id: { $in: files } });
  const deletes = await UploadsModel.deleteMany({ _id: { $in: files } });

  for (const item of items) {
    if (fs.existsSync(item.upload_path)) {
      fs.unlinkSync(item.upload_path);
    }
  }

  const results: ResponseResult = initResponseResult({
    rowsAffected: deletes.deletedCount,
  });
  return sendResponseSuccess(res, { results });
};

export const deleteUpload = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await UploadsModel.findOneAndDelete({ _id: id }).exec();

  if (fs.existsSync(item.upload_path)) {
    fs.unlinkSync(item.upload_path);
  }
  
  const results: ResponseResult = initResponseResult({
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};