import Joi from "joi";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TermsSchema = new Schema(
  {
    term_parent: {
      type: Schema.Types.ObjectId,
      ref: "wp_terms",
      default: null,
    },
    term_name: { type: String, required: true },
    term_slug: { type: String, required: true, unique: true },
    term_taxonomy: {
      type: String,
      default: "category",
      enum: ["category", "tag"],
    },
    term_description: { type: String, default: "" },
    term_count: { type: Number, default: 0 },
  },
  {
    collection: "wp_terms",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

TermsSchema.pre("save", async function () {
  this.term_slug = this.term_slug || this._id;
});

const TermsModel = mongoose.model("wp_terms", TermsSchema);
export default TermsModel;

/* Terms Validate */

export const joiCreateTermSchema = Joi.object({
  term_parent: Joi.string(),
  term_name: Joi.string().required(),
  term_slug: Joi.string().required(),
  term_taxonomy: Joi.string(),
  term_description: Joi.string(),
});

export const joiUpdateTermSchema = Joi.object({
  term_parent: Joi.string(),
  term_name: Joi.string().required(),
  term_slug: Joi.string().required(),
  term_taxonomy: Joi.string(),
  term_description: Joi.string(),
});
