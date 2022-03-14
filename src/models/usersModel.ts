import bcrypt from "bcrypt";
import Joi from "joi";
import mongoose from "mongoose";
import { checkErrorJoiValidate, randomIntByLength } from "../helpers/commonFuncs";
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

export const joiSchema = Joi.object({
  user_login: Joi.string().required(),
  user_pass: Joi.string().required(),
  user_nicename: Joi.string(),
  user_email: Joi.string().required(),
  user_url: Joi.string(),
  user_status: Joi.number(),
  display_name: Joi.string(),
});

UsersSchema.post("validate", async function (doc) {
  // Encode password
  doc.user_pass = await bcrypt.hash(doc.user_pass, 10);

  // Set default value
  doc.user_nicename = doc.user_nicename || doc.user_login;
  doc.display_name = doc.display_name || doc.user_login;

  // Generate activation key
  const generateKey = randomIntByLength(6);
  doc.user_activation_key = await bcrypt.hash(generateKey, 10);
});

export const UsersModel = mongoose.model("wp_users", UsersSchema);

export const getUser = async (id: string) => {
  return await UsersModel.findById(id).exec();
};

export const getUsers = async (args: GetUsersParams) => {
  const { page, pageSize: limit } = args;
  const skip = limit * page - limit;
  const sort = [["user_registered", "descending"]];

  return await UsersModel.find({}).limit(limit).skip(skip).sort(sort).exec();
};

export const createUser = async (args: CreateUserParams) => {
  return new UsersModel(checkErrorJoiValidate(joiSchema.validate(args))).save();
};
