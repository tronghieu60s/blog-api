import { Request, Response } from "express";
import {
  sendResponseResult,
  sendResponseSuccess,
} from "../helpers/commonFuncs";
import * as UsersModal from "../models/usersModel";
import { ResponseResult } from "../types/common";

const { APP_PAGINATION_LIMIT_DEFAULT } = process.env;

export const getUsers = async (req: Request, res: Response) => {
  const q = String(req.query?.q || "");
  const search = String(req.query?.search || "");
  const page = Number(req.query?.page || 1);
  const pageSize = Number(req.query?.pageSize || APP_PAGINATION_LIMIT_DEFAULT);
  const order = String(req.query?.order || "desc");
  const orderby = String(req.query?.orderby || "user_registered");

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

  const results: ResponseResult = sendResponseResult({
    data,
  });
  return res.status(200).json(sendResponseSuccess({ results }));
};

export const getUser = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await UsersModal.getUser(id);
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = sendResponseResult({
    data,
  });
  return res.status(200).json(sendResponseSuccess({ results }));
};

export const createUser = async (req: Request, res: Response) => {
  const item = await UsersModal.createUser(req.body);
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = sendResponseResult({
    data,
    insertId: item._id,
    rowsAffected: item ? 1 : 0,
  });
  return res.status(200).json(sendResponseSuccess({ results }));
};

export const updateUser = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await UsersModal.updateUser(id, req.body);
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = sendResponseResult({
    data,
    rowsAffected: item ? 1 : 0,
  });
  return res.status(200).json(sendResponseSuccess({ results }));
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await UsersModal.deleteUser(id);
  const results: ResponseResult = sendResponseResult({
    rowsAffected: item ? 1 : 0,
  });
  return res.status(200).json(sendResponseSuccess({ results }));
};
