import mongoose from "mongoose";

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

PostsSchema.pre("save", async function () {
  this.post_name = this.post_name || this._id;
});

const PostsModel = mongoose.model("wp_posts", PostsSchema);
export default PostsModel;
