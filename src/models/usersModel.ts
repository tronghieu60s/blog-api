import mongoose from "mongoose";
import { PaginationParams } from "../../types";
const Schema = mongoose.Schema;

const UsersSchema = new Schema(
  {
    user_login: { type: String, required: true, unique: true },
    user_pass: { type: String, required: true },
    user_nicename: { type: String, required: true },
    user_email: { type: String, required: true, unique: true },
    user_url: { type: String, required: true },
    user_registered: { type: Date, required: true },
    user_activation_key: { type: String, required: true },
    user_status: { type: Number, required: true },
    user_display_name: { type: String, required: true },
  },
  {
    collection: "wp_users",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const UsersModel = mongoose.model("wp_users", UsersSchema);

export const getAllUsers = async (args?: PaginationParams) => {
  const skip = args?.page || 1;
  const limit = args?.pageSize || -1;
  const findUsers = await UsersModel.find({}, {}, { skip, limit }).exec();
  return findUsers;
};
