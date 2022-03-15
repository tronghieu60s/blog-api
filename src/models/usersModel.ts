import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { randomIntByLength } from "../helpers/commonFuncs";
import { FilterParams } from "../types/commonTypes";

const { APP_TOKEN_JWT_KEY = "", APP_PAGINATION_LIMIT_DEFAULT } = process.env;

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
      match:
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
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

export const getUsers = async (args: FilterParams) => {
  const {
    q = "",
    search,
    page = 1,
    pageSize: limit = Number(APP_PAGINATION_LIMIT_DEFAULT),
    order,
    orderby = "",
  } = args;
  const skip = limit * page - limit;
  const sort = { [orderby]: order };

  const query = search ? { [search]: new RegExp(q, "i") } : {};
  const items = await UsersModel.find(query, {}, { skip, limit, sort }).exec();
  const count = await UsersModel.countDocuments(query);
  return { items, count };
};

export const createUser = async (args: any) => {
  return new UsersModel(args).save();
};

export const updateUser = async (id: string, args: any) => {
  return await UsersModel.findOneAndUpdate({ _id: id }, args, { new: true });
};

export const deleteUser = async (id: string) => {
  return await UsersModel.findOneAndDelete({ _id: id }).exec();
};

export const authUser = async (
  login: string,
  password: string,
  outdated: number
) => {
  const user = await UsersModel.findOne({
    $or: [{ user_login: login }, { user_email: login }],
  }).exec();
  if (user) {
    const isValid = await bcrypt.compare(password, user.user_pass);
    if (isValid) {
      const token = jwt.sign(
        { login: user._id, outdated: Date.now() + outdated },
        APP_TOKEN_JWT_KEY
      );
      return { user, token };
    }
  }
  return null;
};

export const registerUser = async (args: any) => {
  return await new UsersModel(args).save();
};
