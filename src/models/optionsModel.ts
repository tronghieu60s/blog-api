import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OptionsSchema = new Schema(
  {
    option_name: { type: String, required: true },
    option_value: { type: String, default: "" },
  },
  {
    collection: "wp_options",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const OptionsModel = mongoose.model("wp_options", OptionsSchema);
export default OptionsModel;
