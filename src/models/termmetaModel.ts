import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TermMetaSchema = new Schema(
  {
    meta_id: {
      type: Schema.Types.ObjectId,
      ref: "wp_terms",
      required: true,
    },
    meta_key: { type: String, required: true },
    meta_value: { type: String, default: "" },
  },
  {
    collection: "wp_termmeta",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const TermMetaModel = mongoose.model("wp_termmeta", TermMetaSchema);
export default TermMetaModel;
