import Joi from "joi";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentsSchema = new Schema(
  {
    post_id: {
      type: Schema.Types.ObjectId,
      ref: "wp_posts",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "wp_users",
      default: null,
    },
    comment_parent: {
      type: Schema.Types.ObjectId,
      ref: "wp_comments",
      default: null,
    },
    comment_author: { type: String, required: true },
    comment_author_email: {
      type: String,
      required: true,
      maxlength: 100,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      trim: true,
    },
    comment_author_ip: {
      type: String,
      required: true,
      maxlength: 100,
    },
    comment_content: { type: String, required: true },
    comment_approved: { type: Number, default: 1 },
    comment_type: {
      type: String,
      default: "comment",
      maxlength: 20,
    },
  },
  {
    collection: "wp_comments",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const CommentsModel = mongoose.model("wp_comments", CommentsSchema);
export default CommentsModel;

/* Comments Validate */

export const joiCreateCommentsSchema = Joi.object({
  post_id: Joi.string().required(),
  comment_parent: Joi.string(),
  comment_author: Joi.string(),
  comment_author_email: Joi.string(),
  comment_content: Joi.string().required(),
  comment_approved: Joi.number(),
  comment_type: Joi.string(),
});

export const joiUpdateCommentsSchema = Joi.object({
  comment_author: Joi.string(),
  comment_author_email: Joi.string(),
  comment_content: Joi.string(),
  comment_approved: Joi.number(),
  comment_type: Joi.string(),
});
