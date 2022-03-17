import { Request, Response } from "express";
import {
  initResponseResult,
  randomIntByLength,
  sendResponseError,
  sendResponseSuccess,
} from "../helpers/commonFuncs";
import UsersModel from "../models/usersModel";
import { ResponseResult, TokenParams } from "../helpers/commonTypes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const {
  APP_TOKEN_JWT_KEY = "",
  APP_PAGINATION_LIMIT_DEFAULT,
  APP_TOKEN_EXPIRES_IN,
} = process.env;

export const getUser = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await UsersModel.findById(id).exec();
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

  const skip = pageSize * page - pageSize;
  const sort = { [orderby]: order };

  const query = search ? { [search]: new RegExp(q, "i") } : {};
  const items = await UsersModel.find(
    query,
    {},
    { skip, limit: pageSize, sort }
  ).exec();
  const count = await UsersModel.countDocuments(query);

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
  req.body.user_pass = await bcrypt.hash(req.body.user_pass, 10);
  req.body.user_nicename = req.body.user_nicename || req.body.user_login;
  req.body.display_name = req.body.display_name || req.body.user_login;
  req.body.user_activation_key = await bcrypt.hash(randomIntByLength(6), 10);

  const item = await new UsersModel(req.body).save();
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
  req.body.user_pass = await bcrypt.hash(req.body.user_pass, 10);

  const item = await UsersModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await UsersModel.findOneAndDelete({ _id: id }).exec();
  const results: ResponseResult = initResponseResult({
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const noAuthUser = async (req: Request, res: Response) => {
  const login_ip = req.ip;
  const expire = Number(req.body?.expire || APP_TOKEN_EXPIRES_IN);

  const params: TokenParams = {
    login: null,
    login_level: 0,
    login_ip,
    expire_in: Date.now() + expire,
  };
  const token = jwt.sign(params, APP_TOKEN_JWT_KEY);
  const item = { token };
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const authUser = async (req: Request, res: Response) => {
  const login = String(req.body?.login || "");
  const login_ip = req.ip;
  const password = String(req.body?.password || "");
  const expire = Number(req.body?.expire || APP_TOKEN_EXPIRES_IN);

  const user = await UsersModel.findOne({
    $or: [{ user_login: login }, { user_email: login }],
  }).exec();

  if (!user) {
    return sendResponseError(res, { status: 401, message: "Invalid" });
  }

  const isValid = await bcrypt.compare(password, user.user_pass);
  if (!isValid) {
    return sendResponseError(res, { status: 401, message: "Invalid" });
  }

  const params: TokenParams = {
    login: user._id,
    login_level: 1,
    login_ip,
    expire_in: Date.now() + expire,
  };
  const token = jwt.sign(params, APP_TOKEN_JWT_KEY);
  const item = { user, token };
  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const registerUser = async (req: Request, res: Response) => {
  const item = await new UsersModel(req.body).save();
  const data = item ? { items: [{ user: item }] } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};
