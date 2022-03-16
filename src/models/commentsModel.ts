import mongoose from "mongoose";
import { CreateCommentParams, FilterParams } from "../types/commonTypes";
import { PostsModel } from "./postsModel";

const { APP_PAGINATION_LIMIT_DEFAULT } = process.env;

const Schema = mongoose.Schema;

const CommentsSchema = new Schema(
  {
    post_id: {
      type: Schema.Types.ObjectId,
      ref: "wp_posts",
      required: true,
    },
    comment_author: { type: String, default: "" },
    comment_author_email: {
      type: String,
      default: "",
      maxlength: 100,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      trim: true,
    },
    comment_author_url: {
      type: String,
      default: "",
      maxlength: 100,
      match:
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
      trim: true,
    },
    comment_author_ip: {
      type: String,
      default: "",
      maxlength: 100,
      match:
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    },
    comment_date: { type: Date, default: Date.now },
    comment_date_gmt: { type: Date, default: Date.now },
    comment_content: { type: String, required: true },
    comment_karma: { type: Number, default: 0 },
    comment_approved: { type: Number, default: 1 },
    comment_agent: { type: String, default: "" },
    comment_type: {
      type: String,
      default: "comment",
      maxlength: 20,
    },
    comment_parent: {
      type: Schema.Types.ObjectId,
      ref: "wp_comments",
      default: null,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "wp_users",
      default: null,
    },
  },
  {
    collection: "wp_comments",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const CommentsModel = mongoose.model("wp_comments", CommentsSchema);

export const getComment = async (id: string) => {
  return await CommentsModel.findById(id)
    .populate("post_id")
    .populate("comment_parent")
    .populate("user_id")
    .exec();
};

export const getComments = async (args: FilterParams) => {
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
  const items = await CommentsModel.find(
    query,
    {},
    { skip, limit, sort }
  ).exec();
  const count = await CommentsModel.countDocuments(query);
  return { items, count };
};

export const createComment = async (args: CreateCommentParams) => {
  return new CommentsModel(args).save();
};

export const updateComment = async (id: string, args: any) => {
  return await CommentsModel.findOneAndUpdate({ _id: id }, args, { new: true });
};

export const deleteComment = async (id: string) => {
  return await CommentsModel.findOneAndDelete({ _id: id }).exec();
};