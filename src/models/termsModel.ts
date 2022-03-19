import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TermsSchema = new Schema(
  {
    posts: {
      type: [Schema.Types.ObjectId],
      ref: "wp_posts",
      default: [],
    },
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

const TermsModel = mongoose.model("wp_terms", TermsSchema);
export default TermsModel;
