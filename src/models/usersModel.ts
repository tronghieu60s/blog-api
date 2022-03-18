import Joi from "joi";
import mongoose from "mongoose";

const { APP_LIMIT_DEFAULT_PIN } = process.env;

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
    user_email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      trim: true,
    },
    user_level: { type: Number, default: 0 },
    user_activation_key: { type: String, default: "" },
    user_status: { type: Number, default: 0 },
  },
  {
    collection: "wp_users",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const UsersModel = mongoose.model("wp_users", UsersSchema);
export default UsersModel;

/* Users Validate */

export const joiCreateUserSchema = Joi.object({
  user_login: Joi.string().required(),
  user_pass: Joi.string().required(),
  user_email: Joi.string().required(),
  user_level: Joi.number(),
});

export const joiUpdateUserSchema = Joi.object({
  user_pass: Joi.string(),
  user_email: Joi.string(),
  user_level: Joi.number(),
  user_status: Joi.number(),
});

export const joiAuthUserSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required(),
  expire: Joi.string(),
});

export const joiRegisterUserSchema = Joi.object({
  user_login: Joi.string().required(),
  user_pass: Joi.string().required(),
  user_email: Joi.string().required(),
});

export const joiVerifyUserSchema = Joi.object({
  id: Joi.string(),
  key: Joi.string().length(Number(APP_LIMIT_DEFAULT_PIN)),
  token: Joi.string(),
});
