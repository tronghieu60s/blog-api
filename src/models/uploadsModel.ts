import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UploadsSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    upload_filename: { type: String, required: true },
    upload_title: { type: String, required: true },
    upload_path: { type: String, required: true },
    upload_caption: { type: String, default: "" },
    upload_description: { type: String, default: "" },
    upload_mimetype: { type: String, required: true },
    upload_size: { type: String, required: true },
  },
  {
    collection: "wp_uploads",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const UploadsModel = mongoose.model("wp_uploads", UploadsSchema);
export default UploadsModel;
