import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { CreateUserParams, GetUsersParams } from "../types/usersTypes";

const Schema = mongoose.Schema;

const UsersSchema = new Schema(
  {
    user_login: {
      type: String,
      required: true,
      unique: true,
      maxlength: 60,
      match: /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
    },
    user_pass: { type: String, required: true },
    user_nicename: { type: String, default: "", maxlength: 50 },
    user_email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    user_url: { type: String, default: "", maxlength: 100 },
    user_registered: { type: Date, required: true, default: Date.now },
    user_activation_key: { type: String, default: "" },
    user_status: { type: Number, default: 0 },
    display_name: { type: String, default: "" },
  },
  {
    collection: "wp_users",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const UsersModel = mongoose.model("wp_users", UsersSchema);

export const getUser = async (id: string) => {
  const findUser = await UsersModel.findById(id).exec();
  return findUser;
};

export const getUsers = async (args?: GetUsersParams) => {
  const skip = args?.page || 1;
  const limit = args?.pageSize || -1;

  const findUsers = await UsersModel.find({}, {}, { skip, limit }).exec();
  return findUsers;
};

export const createUser = async (args: CreateUserParams) => {
  let { user_pass } = args;
  user_pass = await bcrypt.hash(user_pass, 10);

  const createUser = new UsersModel({ ...args, user_pass }).save();
  return createUser;
};
