import mongoose from "mongoose";
import { FilterParams } from "../helpers/commonTypes";

const { APP_PAGINATION_LIMIT_DEFAULT } = process.env;

const Schema = mongoose.Schema;

const PostsSchema = new Schema(
  {
    post_author: {
      type: Schema.Types.ObjectId,
      ref: "wp_users",
      required: true,
    },
    post_date: { type: Date, default: Date.now },
    post_date_gmt: { type: Date, default: Date.now },
    post_content: { type: String, required: true },
    post_title: { type: String, required: true },
    post_excerpt: { type: String, default: "" },
    post_status: {
      type: String,
      default: "publish",
      enum: ["pending", "private", "publish", "draft", "auto-draft", "trash"],
      maxlength: 20,
    },
    comment_status: {
      type: String,
      default: "open",
      enum: ["open", "closed"],
      maxlength: 20,
    },
    ping_status: {
      type: String,
      default: "open",
      enum: ["open", "closed"],
      maxlength: 20,
    },
    post_password: { type: String, default: "" },
    post_name: { type: String, unique: true },
    to_ping: { type: String, default: "" },
    pinged: { type: String, default: "" },
    post_modified: { type: Date, default: Date.now },
    post_modified_gmt: { type: Date, default: Date.now },
    post_content_filtered: { type: String, default: "" },
    post_parent: {
      type: Schema.Types.ObjectId,
      ref: "wp_posts",
      default: null,
    },
    guid: { type: String, default: "" },
    menu_order: { type: Number, default: 0 },
    post_type: {
      type: String,
      default: "post",
      enum: ["post", "page", "attachment", "revision"],
      maxlength: 20,
    },
    post_mime_type: { type: String, default: "" },
    comment_count: { type: Number, default: 0 },
  },
  {
    collection: "wp_posts",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const PostsModel = mongoose.model("wp_posts", PostsSchema);

export const getPost = async (id: string) => {
  return await PostsModel.findById(id)
    .populate("post_author")
    .populate("post_parent")
    .exec();
};

export const getPosts = async (args: FilterParams) => {
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
  const items = await PostsModel.find(query, {}, { skip, limit, sort }).exec();
  const count = await PostsModel.countDocuments(query);
  return { items, count };
};

export const createPost = async (args: any) => {
  args.post_name = args.post_name || args._id;
  return new PostsModel(args).save();
};

export const updatePost = async (id: string, args: any) => {
  return await PostsModel.findOneAndUpdate({ _id: id }, args, { new: true });
};

export const deletePost = async (id: string) => {
  return await PostsModel.findOneAndDelete({ _id: id }).exec();
};
