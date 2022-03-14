import { Request, Response } from "express";
import { sendResponseSuccess } from "../helpers/commonFuncs";
import { createUser, getUsers, UsersModel } from "../models/usersModel";

export const index = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || -1;
  const items = await getUsers({ page, pageSize });
  const countDocuments = await UsersModel.countDocuments({});

  const results = {
    rows: {
      items,
      pageTotal: countDocuments / page,
      page,
      pageSize,
    },
  };
  return res.status(200).json(sendResponseSuccess({ results }));
};

export const create = async (req: Request, res: Response) => {
  const rows = await createUser(req.body);

  const results = {
    rows: [rows],
    insertId: rows._id,
    rowsAffected: 1,
  };
  return res.status(200).json(sendResponseSuccess({ results }));
};
