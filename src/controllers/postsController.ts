import { Request, Response } from "express";
import {
  initResponseResult,
  sendResponseSuccess,
} from "../helpers/commonFuncs";
import * as PostsModel from "../models/postsModel";
import { ResponseResult } from "../helpers/commonTypes";

const { APP_PAGINATION_LIMIT_DEFAULT } = process.env;

export const getPost = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await PostsModel.getPost(id);
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const getPosts = async (req: Request, res: Response) => {
  const q = String(req.query?.q || "");
  const search = String(req.query?.search || "");
  const page = Number(req.query?.page || 1);
  const pageSize = Number(req.query?.pageSize || APP_PAGINATION_LIMIT_DEFAULT);
  const order = String(req.query?.order || "desc");
  const orderby = String(req.query?.orderby || "updated_at");

  const { items, count } = await PostsModel.getPosts({
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

export const createPost = async (req: Request, res: Response) => {
  const item = await PostsModel.createPost({
    ...req.body,
    post_author: (req as any).login,
  });
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    insertId: item._id,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const updatePost = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await PostsModel.updatePost(id, req.body);
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const deletePost = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await PostsModel.deletePost(id);
  const results: ResponseResult = initResponseResult({
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};
