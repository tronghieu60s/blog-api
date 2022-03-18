import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserMetaSchema = new Schema(
  {
    user_id: { type: String, required: true },
    user_meta_key: { type: String, required: true },
    user_meta_value: { type: String, default: null },
  },
  {
    collection: "wp_usermeta",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const UserMetaModel = mongoose.model("wp_usermeta", UserMetaSchema);
export default UserMetaModel;
