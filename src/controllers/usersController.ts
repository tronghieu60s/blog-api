import { Request, Response } from "express";
import { sendResponseSuccess } from "../helpers/commonFuncs";
import { createUser, getUsers } from "../models/usersModel";
import { ResponseResult } from "../types/common";

const { APP_PAGINATION_LIMIT_DEFAULT } = process.env;

export const index = async (req: Request, res: Response) => {
  const q = String(req.query.q || "");
  const search = String(req.query.search || "");
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query?.pageSize || APP_PAGINATION_LIMIT_DEFAULT);
  const order = String(req.query?.order || "desc");
  const orderby = String(req.query?.orderby || "user_registered");

  const { items, count } = await getUsers({
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

  const results: ResponseResult = {
    data: {
      items,
      pageTotal,
      page,
      pageSize,
      nextPage,
      previousPage,
    },
  };
  return res.status(200).json(sendResponseSuccess({ results }));
};

export const create = async (req: Request, res: Response) => {
  const item = await createUser(req.body);

  const results: ResponseResult = {
    data: {
      items: [item],
    },
    insertId: item._id,
    rowsAffected: 1,
  };
  return res.status(200).json(sendResponseSuccess({ results }));
};
