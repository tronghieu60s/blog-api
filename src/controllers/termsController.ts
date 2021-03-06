import { Request, Response } from "express";
import { ResponseResult } from "../common/types";
import {
  initResponseResult,
  sendResponseSuccess,
} from "../helpers/commonFuncs";
import TermMetaModel from "../models/termmetaModel";
import TermsModel from "../models/termsModel";

const { APP_LIMIT_DEFAULT_PAGINATION } = process.env;

/* Terms */

export const getTerm = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await TermsModel.findById(id).populate("term_parent").exec();
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const getTerms = async (req: Request, res: Response) => {
  const q = String(req.query?.q || "");
  const search = String(req.query?.search || "");
  const page = Number(req.query?.page || 1);
  const pageSize = Number(req.query?.pageSize || APP_LIMIT_DEFAULT_PAGINATION);
  const order = String(req.query?.order || "desc");
  const orderby = String(req.query?.orderby || "updated_at");

  const skip = pageSize * page - pageSize;
  const sort = { [orderby]: order };

  const query = search ? { [search]: new RegExp(q, "i") } : {};
  const items = await TermsModel.find(
    query,
    {},
    { skip, limit: pageSize, sort }
  ).exec();
  const total = await TermsModel.countDocuments(query);

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

export const createTerm = async (req: Request, res: Response) => {
  const item = await new TermsModel(req.body).save();
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    insertId: item._id,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const updateTerm = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await TermsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const deleteTerms = async (req: Request, res: Response) => {
  const ids = req.body?.ids || [];
  const items = await TermsModel.deleteMany({ _id: { $in: ids } }).exec();
  const results: ResponseResult = initResponseResult({
    rowsAffected: items ? items.deletedCount : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const deleteTerm = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await TermsModel.findOneAndDelete({ _id: id }).exec();
  const results: ResponseResult = initResponseResult({
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

/* Terms Meta */

export const getTermMeta = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const key = String(req.params?.key || "");

  const query = key ? { user_id: id, meta_key: key } : { user_id: id };
  const items = await TermMetaModel.find(query);
  const data = items ? { items } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const createTermMeta = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await new TermMetaModel({ ...req.body, meta_id: id }).save();

  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const updateTermMeta = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const key = String(req.params?.key || "");

  const item = await TermMetaModel.findOneAndUpdate(
    { meta_id: id, meta_key: key },
    req.body,
    { new: true }
  );
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const deleteTermMeta = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const key = String(req.params?.key || "");

  const item = await TermMetaModel.findOneAndDelete({
    meta_id: id,
    meta_key: key,
  });
  const results: ResponseResult = initResponseResult({
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};
