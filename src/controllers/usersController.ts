import { Request, Response } from "express";
import { sendResponseSuccess } from "../helpers/commonFuncs";
import { createUser, getUsers, UsersModel } from "../models/usersModel";
import { ResponseResult } from "../types/common";

const { APP_PAGINATION_LIMIT_DEFAULT } = process.env;

export const index = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const pageSize =
    Number(req.query.pageSize) || Number(APP_PAGINATION_LIMIT_DEFAULT);

  const items = await getUsers({ page, pageSize });
  const count = await UsersModel.countDocuments({});
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
