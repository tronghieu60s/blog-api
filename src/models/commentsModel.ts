import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentsSchema = new Schema(
  {
    post_id: {
      type: Schema.Types.ObjectId,
      ref: "wp_posts",
      required: true,
    },
    comment_author: { type: String, required: true },
    comment_author_email: {
      type: String,
      required: true,
      maxlength: 100,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      trim: true,
    },
    comment_author_url: {
      type: String,
      required: true,
      maxlength: 100,
      match:
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
      trim: true,
    },
    comment_author_ip: {
      type: String,
      required: true,
      maxlength: 100,
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

const CommentsModel = mongoose.model("wp_comments", CommentsSchema);
export default CommentsModel;
