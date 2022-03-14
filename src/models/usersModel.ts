import bcrypt from "bcrypt";
import Joi from "joi";
import mongoose from "mongoose";
import {
  checkErrorJoiValidate,
  randomIntByLength,
} from "../helpers/commonFuncs";
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
      trim: true,
    },
    user_pass: { type: String, required: true },
    user_nicename: { type: String, default: "", maxlength: 50 },
    user_email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      trim: true,
    },
    user_url: {
      type: String,
      default: "",
      maxlength: 100,
      trim: true,
    },
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

export const joiCreateSchema = Joi.object({
  user_login: Joi.string().required(),
  user_pass: Joi.string().required(),
  user_nicename: Joi.string(),
  user_email: Joi.string().required(),
  user_url: Joi.string(),
  user_status: Joi.number(),
  display_name: Joi.string(),
});

export const joiUpdateSchema = Joi.object({
  user_pass: Joi.string(),
  user_nicename: Joi.string(),
  user_email: Joi.string(),
  user_url: Joi.string(),
  user_status: Joi.number(),
  display_name: Joi.string(),
});

UsersSchema.pre("save", async function () {
  // Encode password
  this.user_pass = await bcrypt.hash(this.user_pass, 10);

  // Set default value
  this.user_nicename = this.user_nicename || this.user_login;
  this.display_name = this.display_name || this.user_login;

  // Generate activation key
  const generateKey = randomIntByLength(6);
  this.user_activation_key = await bcrypt.hash(generateKey, 10);
});

UsersSchema.pre("findOneAndUpdate", async function () {
  const doc = (this as any)._update;
  // Encode password
  doc.user_pass = await bcrypt.hash(doc.user_pass, 10);
});

export const UsersModel = mongoose.model("wp_users", UsersSchema);

export const getUser = async (id: string) => {
  return await UsersModel.findById(id).exec();
};

export const getUsers = async (args: GetUsersParams) => {
  const { q, search, page, pageSize: limit, order, orderby } = args;
  const skip = limit * page - limit;
  const sort = { [orderby]: order };

  const query = search ? { [search]: new RegExp(q, "i") } : {};
  const items = await UsersModel.find(query, {}, { skip, limit, sort }).exec();
  const count = await UsersModel.countDocuments(query);
  return { items, count };
};

export const createUser = async (args: CreateUserParams) => {
  return new UsersModel(
    checkErrorJoiValidate(joiCreateSchema.validate(args))
  ).save();
};

export const updateUser = async (id: string, args: CreateUserParams) => {
  return await UsersModel.findOneAndUpdate(
    { _id: id },
    checkErrorJoiValidate(joiUpdateSchema.validate(args)),
    { new: true }
  );
};

export const deleteUser = async (id: string) => {
  return await UsersModel.findOneAndDelete({ _id: id }).exec();
};
