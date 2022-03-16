import { Request, Response } from "express";
import {
  initResponseResult,
  sendResponseSuccess,
} from "../helpers/commonFuncs";
import * as CommentsModel from "../models/commentsModel";
import * as UsersModel from "../models/usersModel";
import { ResponseResult } from "../types/commonTypes";

const { APP_PAGINATION_LIMIT_DEFAULT } = process.env;

export const getComment = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await CommentsModel.getComment(id);
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const getComments = async (req: Request, res: Response) => {
  const q = String(req.query?.q || "");
  const search = String(req.query?.search || "");
  const page = Number(req.query?.page || 1);
  const pageSize = Number(req.query?.pageSize || APP_PAGINATION_LIMIT_DEFAULT);
  const order = String(req.query?.order || "desc");
  const orderby = String(req.query?.orderby || "updated_at");

  const { items, count } = await CommentsModel.getComments({
    q,
    search,
    page,
    pageSize,
    order,
    orderby,
  });
  const pageTotal = Math.ceil(count / pageSize);
  const nextPage = page >= pageTotal ? null : page + 1;
  const previousPage = page <= 1 ? null : page - 1;

  const data = {
    items,
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

export const createComment = async (req: Request, res: Response) => {
  if ((req as any).login) {
    const user = await UsersModel.getUser((req as any).login);
    req.body = {
      ...req.body,
      comment_author: req.body.comment_author || user.display_name,
      comment_author_email: req.body.comment_author_email || user.user_email,
      comment_author_url: req.body.comment_author_url || user.user_url,
    };
  }
  req.body.comment_author_ip = req.body.comment_author_ip || req.ip;

  const item = await CommentsModel.createComment(req.body);
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    insertId: item._id,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const updateComment = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await CommentsModel.updateComment(id, req.body);
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const deleteComment = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await CommentsModel.deleteComment(id);
  const results: ResponseResult = initResponseResult({
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};
