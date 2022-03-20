import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostMetaSchema = new Schema(
  {
    post_id: {
      type: Schema.Types.ObjectId,
      ref: "wp_posts",
      required: true,
    },
    post_meta_key: { type: String, required: true },
    post_meta_value: { type: String, default: "" },
  },
  {
    collection: "wp_postmeta",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const PostMetaModel = mongoose.model("wp_postmeta", PostMetaSchema);
export default PostMetaModel;
