import { Request, Response } from "express";
import { getAllUsers, UsersModel } from "../models/usersModel";

export const index = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || -1;
  const items = await getAllUsers({ page, pageSize });
  const countDocuments = await UsersModel.countDocuments({});
  return res
    .status(200)
    .json({
      status: 200,
      data: { items, totalPage: countDocuments / page, page, pageSize },
    });
};
