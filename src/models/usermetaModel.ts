import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserMetaSchema = new Schema(
  {
    meta_id: {
      type: Schema.Types.ObjectId,
      ref: "wp_users",
      required: true,
    },
    meta_key: { type: String, required: true },
    meta_value: { type: String, default: "" },
  },
  {
    collection: "wp_usermeta",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const UserMetaModel = mongoose.model("wp_usermeta", UserMetaSchema);
export default UserMetaModel;
