import { Request, Response } from "express";
import {
  initResponseResult,
  sendResponseSuccess,
} from "../helpers/commonFuncs";
import * as PostsModel from "../models/postsModel";
import { ResponseResult } from "../types/commonTypes";

export const getPosts = async (req: Request, res: Response) => {
  return sendResponseSuccess(res, {});
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
