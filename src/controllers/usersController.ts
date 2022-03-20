import { Request, Response } from "express";
import {
  initResponseResult,
  randomIntByLength,
  sendResponseError,
  sendResponseSuccess,
} from "../helpers/commonFuncs";
import UsersModel from "../models/usersModel";
import { ResponseResult, TokenParams } from "../common/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../helpers/nodemailer";
import UserMetaModel from "../models/usermetaModel";

const {
  APP_TOKEN_JWT_KEY = "",
  APP_LIMIT_BCRYPT_ROUNDS,
  APP_LIMIT_DEFAULT_PIN,
  APP_LIMIT_DEFAULT_PAGINATION,
  APP_TOKEN_EXPIRES_IN,
} = process.env;

const sendEmailAccountVerification = async (
  email: string,
  verify_key: string,
  activation_key: string
) => {
  const content = `Key Verify: ${verify_key}.
Token Verify: ${activation_key}.`;
  return sendEmail(email, "Account Verification", content);
};

const sendEmailPasswordReset = async (email: string, token: string) => {
  let content = "";
  if (token.length === Number(APP_LIMIT_DEFAULT_PIN)) {
    content = `Password: ${token}.`;
  } else {
    content = `Token Reset: ${token}.`;
  }
  return sendEmail(email, "Password Reset", content);
};

/* Users */

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
  const pageSize = Number(req.query?.pageSize || APP_LIMIT_DEFAULT_PAGINATION);
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
  const total = await UsersModel.countDocuments(query);

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

export const createUser = async (req: Request, res: Response) => {
  req.body.user_pass = await bcrypt.hash(
    req.body.user_pass,
    Number(APP_LIMIT_BCRYPT_ROUNDS)
  );

  const key = randomIntByLength(Number(APP_LIMIT_DEFAULT_PIN));
  req.body.user_activation_key = await bcrypt.hash(
    key,
    Number(APP_LIMIT_BCRYPT_ROUNDS)
  );

  const item = await new UsersModel(req.body).save();
  if (item) {
    sendEmailAccountVerification(
      item.user_email,
      key,
      item.user_activation_key
    );
  }
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
  req.body.user_pass = await bcrypt.hash(
    req.body.user_pass,
    Number(APP_LIMIT_BCRYPT_ROUNDS)
  );

  let key = "";
  let isChangeEmail = false;
  const item = await UsersModel.findOne({ _id: id }).exec();
  if (item && item?.user_email !== req.body?.user_email) {
    isChangeEmail = true;
    key = randomIntByLength(Number(APP_LIMIT_DEFAULT_PIN));
    req.body.user_activation_key = await bcrypt.hash(
      key,
      Number(APP_LIMIT_BCRYPT_ROUNDS)
    );
  }

  const update = await UsersModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (update && isChangeEmail) {
    sendEmailAccountVerification(
      update.user_email,
      key,
      update.user_activation_key
    );
  }

  const data = update ? { items: [update] } : {};
  const results: ResponseResult = initResponseResult({
    data,
    rowsAffected: update ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const deleteUsers = async (req: Request, res: Response) => {
  const ids = req.body?.ids || [];
  const items = await UsersModel.deleteMany({ _id: { $in: ids } }).exec();
  const results: ResponseResult = initResponseResult({
    rowsAffected: items ? items.deletedCount : 0,
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

/* Users Meta */

export const getUserMeta = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const key = String(req.params?.key || "");

  const query = key ? { user_id: id, meta_key: key } : { user_id: id };
  const items = await UserMetaModel.find(query);
  const data = items ? { items } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const createUserMeta = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const item = await new UserMetaModel({ ...req.body, meta_id: id }).save();

  const data = item ? { items: [item] } : {};
  const results: ResponseResult = initResponseResult({
    data,
  });
  return sendResponseSuccess(res, { results });
};

export const updateUserMeta = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const key = String(req.params?.key || "");

  const item = await UserMetaModel.findOneAndUpdate(
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

export const deleteUserMeta = async (req: Request, res: Response) => {
  const id = String(req.params?.id || "");
  const key = String(req.params?.key || "");

  const item = await UserMetaModel.findOneAndDelete({
    meta_id: id,
    meta_key: key,
  });
  const results: ResponseResult = initResponseResult({
    rowsAffected: item ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

/* Identity */

export const noAuthUser = async (req: Request, res: Response) => {
  const login_ip = req.ip;
  const expire = Number(req.body?.expire || APP_TOKEN_EXPIRES_IN);

  const params: TokenParams = {
    login: null,
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

export const verifyUser = async (req: Request, res: Response) => {
  const id = String(req.body?.id || "");
  const key = String(req.body?.key || "");
  const token = String(req.body?.token || "");
  console.log(token);
  let isUpdate = false;
  if (id) {
    const item = await UsersModel.findOne({ _id: id }).exec();
    if (item) {
      const compare = bcrypt.compareSync(key, item.user_activation_key);
      if (compare) {
        const update = await UsersModel.findOneAndUpdate(
          { _id: id },
          { user_activation_key: "" },
          { new: true }
        );
        if (update) {
          isUpdate = true;
        }
      } else {
        return sendResponseError(res, { status: 401, message: "Key Invalid" });
      }
    }
  } else if (token) {
    const item = await UsersModel.findOneAndUpdate(
      { user_activation_key: token },
      { user_activation_key: "" },
      { new: true }
    );
    if (item) {
      isUpdate = true;
    } else {
      return sendResponseError(res, { status: 401, message: "Token Invalid" });
    }
  }

  const results: ResponseResult = initResponseResult({
    rowsAffected: isUpdate ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const verifyUserResend = async (req: Request, res: Response) => {
  const id = String(req.body?.id || "");
  const key = randomIntByLength(Number(APP_LIMIT_DEFAULT_PIN));
  req.body.user_activation_key = await bcrypt.hash(
    key,
    Number(APP_LIMIT_BCRYPT_ROUNDS)
  );

  const update = await UsersModel.findOneAndUpdate(
    { _id: id, user_activation_key: { $ne: "" } },
    req.body,
    {
      new: true,
    }
  );

  if (update) {
    sendEmailAccountVerification(
      update.user_email,
      key,
      update.user_activation_key
    );
  }

  const results: ResponseResult = initResponseResult({
    rowsAffected: update ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};

export const resetPassword = async (req: Request, res: Response) => {
  const login = String(req.body?.login || "");
  const user_pass = randomIntByLength(Number(APP_LIMIT_DEFAULT_PIN));
  req.body.user_pass = await bcrypt.hash(
    user_pass,
    Number(APP_LIMIT_BCRYPT_ROUNDS)
  );

  const update = await UsersModel.findOneAndUpdate(
    { $or: [{ user_login: login }, { user_email: login }] },
    req.body,
    { new: true }
  );

  if (update) {
    await sendEmailPasswordReset(update.user_email, user_pass).catch((err) => {
      throw err;
    });
  }

  const results: ResponseResult = initResponseResult({
    rowsAffected: update ? 1 : 0,
  });
  return sendResponseSuccess(res, { results });
};
