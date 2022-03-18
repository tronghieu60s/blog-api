import Joi from "joi";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostsSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "wp_users",
      required: true,
    },
    post_parent: {
      type: Schema.Types.ObjectId,
      ref: "wp_posts",
      default: null,
    },
    post_content: { type: String, required: true },
    post_title: { type: String, required: true },
    post_excerpt: { type: String, default: "" },
    post_status: {
      type: String,
      default: "publish",
      enum: ["pending", "private", "publish", "draft", "auto-draft", "trash"],
      maxlength: 20,
    },
    post_comment_status: {
      type: String,
      default: "open",
      enum: ["open", "closed"],
      maxlength: 20,
    },
    post_password: { type: String, default: "" },
    post_slug: { type: String, unique: true },
    post_type: {
      type: String,
      default: "post",
      enum: ["post", "page", "attachment", "revision"],
      maxlength: 20,
    },
    comment_count: { type: Number, default: 0 },
  },
  {
    collection: "wp_posts",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

PostsSchema.pre("save", async function () {
  this.post_slug = this.post_slug || this._id;
});

const PostsModel = mongoose.model("wp_posts", PostsSchema);
export default PostsModel;

/* Posts Validate */

export const joiCreatePostsSchema = Joi.object({
  post_content: Joi.string().required(),
  post_title: Joi.string().required(),
  post_excerpt: Joi.string(),
  post_status: Joi.string(),
  post_comment_status: Joi.string(),
  post_password: Joi.string(),
  post_slug: Joi.string(),
  post_parent: Joi.string(),
  post_type: Joi.string(),
});

export const joiUpdatePostsSchema = Joi.object({
  post_content: Joi.string(),
  post_title: Joi.string(),
  post_excerpt: Joi.string(),
  post_status: Joi.string(),
  post_comment_status: Joi.string(),
  post_password: Joi.string(),
  post_slug: Joi.string(),
  post_parent: Joi.string(),
  post_type: Joi.string(),
});
