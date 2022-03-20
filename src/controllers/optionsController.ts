import { Request, Response } from "express";
import { ResponseResult } from "../common/types";
import {
  initResponseResult,
  sendResponseSuccess,
} from "../helpers/commonFuncs";
import OptionsModel from "../models/optionsModel";

/* Options */

export const getOption = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await OptionsModel.findById(id).exec();
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const getOptions = async (req: Request, res: Response) => {
  const items = await OptionsModel.find({}).exec();
  const data = items ? { items } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const createOption = async (req: Request, res: Response) => {
  const item = await new OptionsModel(req.body).save();
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    insertId: item._id,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const updateOption = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await OptionsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const deleteOption = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await OptionsModel.findOneAndDelete({ _id: id }).exec();
  const results: ResponseResult = initResponseResult({
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};
