import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentMetaSchema = new Schema(
  {
    comment_id: {
      type: Schema.Types.ObjectId,
      ref: "wp_comments",
      required: true,
    },
    comment_meta_key: { type: String, required: true },
    comment_meta_value: { type: String, default: "" },
  },
  {
    collection: "wp_commentmeta",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const CommentMetaModel = mongoose.model("wp_commentmeta", CommentMetaSchema);
export default CommentMetaModel;
