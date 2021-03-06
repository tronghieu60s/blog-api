import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ResponseResult } from "../common/types";
import {
  initResponseResult,
  sendResponseSuccess,
} from "../helpers/commonFuncs";
import PostMetaModel from "../models/postmetaModel";
import PostsModel from "../models/postsModel";

const { APP_LIMIT_BCRYPT_ROUNDS, APP_LIMIT_DEFAULT_PAGINATION } = process.env;

/* Posts */

export const getPost = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await PostsModel.findById(id)
    .populate("user_id")
    .populate("post_parent")
    .exec();
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
  const pageSize = Number(req.query?.pageSize || APP_LIMIT_DEFAULT_PAGINATION);
  const order = String(req.query?.order || "desc");
  const orderby = String(req.query?.orderby || "updated_at");

  const skip = pageSize * page - pageSize;
  const sort = { [orderby]: order };

  const query = search ? { [search]: new RegExp(q, "i") } : {};
  const items = await PostsModel.find(
    query,
    {},
    { skip, limit: pageSize, sort }
  ).exec();
  const total = await PostsModel.countDocuments(query);

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

export const createPost = async (req: Request, res: Response) => {
  if (req.body.post_password) {
    req.body.post_password = await bcrypt.hash(
      req.body.post_password,
      Number(APP_LIMIT_BCRYPT_ROUNDS)
    );
  }

  const item = await new PostsModel({
    ...req.body,
    user_id: (req as any).login,
  }).save();
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    insertId: item._id,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const updatePost = async (req: Request, res: Response) => {
  if (req.body.post_password) {
    req.body.post_password = await bcrypt.hash(
      req.body.post_password,
      Number(APP_LIMIT_BCRYPT_ROUNDS)
    );
  }
  
  const id = String(req.params?.id || "");
  const item = await PostsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const deletePosts = async (req: Request, res: Response) => {
  const ids = req.body?.ids || [];
  const items = await PostsModel.deleteMany({ _id: { $in: ids } }).exec();
  const results: ResponseResult = initResponseResult({
    rowsAffected: items ? items.deletedCount : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const deletePost = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await PostsModel.findOneAndDelete({ _id: id }).exec();
  const results: ResponseResult = initResponseResult({
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

/* Posts Meta */

export const getPostMeta = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const key = String(req.params?.key || "");

  const query = key ? { user_id: id, meta_key: key } : { user_id: id };
  const items = await PostMetaModel.find(query);
  const data = items ? { items } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const createPostMeta = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await new PostMetaModel({ ...req.body, meta_id: id }).save();

  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const updatePostMeta = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const key = String(req.params?.key || "");

  const item = await PostMetaModel.findOneAndUpdate(
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

export const deletePostMeta = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const key = String(req.params?.key || "");

  const item = await PostMetaModel.findOneAndDelete({
    meta_id: id,
    meta_key: key,
  });
  const results: ResponseResult = initResponseResult({
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};
