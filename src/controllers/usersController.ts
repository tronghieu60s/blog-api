import { Request, Response } from "express";
import {
  initResponseResult,
  sendResponseSuccess,
} from "../helpers/commonFuncs";
import * as UsersModal from "../models/usersModel";
import { ResponseResult } from "../types/commonTypes";

const { APP_PAGINATION_LIMIT_DEFAULT, APP_TOKEN_EXPIRES_IN } = process.env;

export const getUser = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await UsersModal.getUser(id);
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const getUsers = async (req: Request, res: Response) => {
  const q = String(req.query?.q || "");
  const search = String(req.query?.search || "");
  const page = Number(req.query?.page || 1);
  const pageSize = Number(req.query?.pageSize || APP_PAGINATION_LIMIT_DEFAULT);
  const order = String(req.query?.order || "desc");
  const orderby = String(req.query?.orderby || "updated_at");

  const { items, count } = await UsersModal.getUsers({
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

export const createUser = async (req: Request, res: Response) => {
  const item = await UsersModal.createUser(req.body);
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    insertId: item._id,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const updateUser = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await UsersModal.updateUser(id, req.body);
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await UsersModal.deleteUser(id);
  const results: ResponseResult = initResponseResult({
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const authUser = async (req: Request, res: Response) => {
  const login = String(req.body?.login || "");
  const password = String(req.body?.password || "");
  const outdated = Number(req.body?.outdated || APP_TOKEN_EXPIRES_IN);

  const item = await UsersModal.authUser(login, password, outdated);
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const registerUser = async (req: Request, res: Response) => {
  const item = await UsersModal.registerUser(req.body);
  const data = item ? { items: [{ user: item }] } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};
