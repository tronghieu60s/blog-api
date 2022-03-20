import Joi from "joi";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OptionsSchema = new Schema(
  {
    option_name: { type: String, required: true, unique: true },
    option_value: { type: String, default: "" },
  },
  {
    collection: "wp_options",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const OptionsModel = mongoose.model("wp_options", OptionsSchema);
export default OptionsModel;

export const joiCreateOptionSchema = Joi.object({
  option_name: Joi.string().required(),
  option_value: Joi.string().allow(""),
});

export const joiUpdateOptionSchema = Joi.object({
  option_value: Joi.string().allow(""),
});
